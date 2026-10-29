import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useBounceWorkflow, {
  BounceWorkflow,
} from '../renderer/bounce/useBounceWorkflow';
import { BounceTransport } from '../renderer/bounce/types';

let workflow: BounceWorkflow;

function Harness({ transport }: { transport: BounceTransport }) {
  workflow = useBounceWorkflow(transport);
  return null;
}

function renderWorkflow(transport: BounceTransport) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <Harness transport={transport} />
    </QueryClientProvider>
  );
}

const session = (date_string: string) => ({ epoch: 0, date_string });
const row = (ticker: string) => ({
  id: 1,
  ticker,
  open: 100,
  close: 105,
  volume: 1000,
  open_close_change_pct: 5,
  frequencies: 'T-1',
});

function makeTransport(): BounceTransport {
  return {
    getBounceSessions: jest.fn(async ({ cursor }: { cursor?: string }) =>
      cursor
        ? { items: [session('2024-01-03')], next_cursor: null }
        : {
            items: [session('2024-01-01'), session('2024-01-02')],
            next_cursor: 'page-2',
          }
    ),
    getBounceResults: jest.fn(async (request) => ({
      schema_version: 1 as const,
      market: 'US' as const,
      date: request.date,
      period: request.period,
      price_range: request.price_range,
      rows: request.tickers
        ? request.tickers.map((ticker, index) => ({
            ...row(ticker),
            id: index + 1,
          }))
        : [row('AAA'), row('BBB')],
      missing_tickers: [],
      coverage: 'exact' as const,
    })),
  };
}

describe('useBounceWorkflow', () => {
  it('loads every session page before initializing the latest date', async () => {
    const transport = makeTransport();
    renderWorkflow(transport);

    await waitFor(() => expect(workflow.selectedDate).toBe('2024-01-03'));

    expect(transport.getBounceSessions).toHaveBeenCalledTimes(2);
    expect(workflow.sessions.map((item) => item.date_string)).toEqual([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
    ]);
    expect(workflow.sessionsLoading).toBe(false);
  });

  it('keeps complete screen and origin-safe ordered tracking queries', async () => {
    const transport = makeTransport();
    renderWorkflow(transport);
    await waitFor(() => expect(workflow.selectedDate).toBe('2024-01-03'));

    act(() => {
      workflow.selectDate('2024-01-01');
      workflow.setPeriod(6);
      workflow.setPriceRange('100to299_99');
    });
    await waitFor(() => expect(workflow.result?.date).toBe('2024-01-01'));

    act(() => workflow.track(1));
    await waitFor(() => expect(workflow.result?.date).toBe('2024-01-02'));

    expect(transport.getBounceResults).toHaveBeenLastCalledWith({
      date: '2024-01-02',
      period: 6,
      price_range: '100to299_99',
      tickers: ['AAA', 'BBB'],
    });
    expect(workflow.trackingDate).toBe('2024-01-02');

    act(() => workflow.track(2));
    await waitFor(() => expect(workflow.result?.date).toBe('2024-01-03'));
    expect(workflow.mode).toBe('tracking');

    act(() => workflow.returnToScreen());
    await waitFor(() => expect(workflow.result?.date).toBe('2024-01-01'));
    expect(workflow.mode).toBe('screen');
    expect(workflow.period).toBe(6);
  });

  it('marks future tracking unavailable instead of reading a stale cached screen', async () => {
    const transport = makeTransport();
    renderWorkflow(transport);
    await waitFor(() => expect(workflow.result?.date).toBe('2024-01-03'));

    expect(workflow.trackingAvailability[1]).toBe(false);
    expect(workflow.trackingAvailability[2]).toBe(false);

    act(() => workflow.track(1));
    expect(workflow.mode).toBe('screen');
    expect(transport.getBounceResults).not.toHaveBeenCalledWith(
      expect.objectContaining({ tickers: expect.any(Array) })
    );
  });

  it('surfaces a later session-page error instead of staying in loading', async () => {
    const transport = makeTransport();
    transport.getBounceSessions = jest.fn(async ({ cursor }) => {
      if (cursor) throw new Error('page unavailable');
      return {
        items: [session('2024-01-01')],
        next_cursor: 'page-2',
      };
    });
    renderWorkflow(transport);

    await waitFor(() => expect(workflow.sessionsError).toBeTruthy());
    expect(workflow.sessionsLoading).toBe(false);
    expect(workflow.selectedDate).toBeNull();
    const failedCallCount = (transport.getBounceSessions as jest.Mock).mock
      .calls.length;
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(transport.getBounceSessions).toHaveBeenCalledTimes(failedCallCount);
  });

  it('returns an idle empty workflow when no bounce-ready sessions exist', async () => {
    const transport = makeTransport();
    transport.getBounceSessions = jest.fn(async () => ({
      items: [],
      next_cursor: null,
    }));
    renderWorkflow(transport);

    await waitFor(() => expect(workflow.sessionsLoading).toBe(false));
    expect(workflow.sessions).toEqual([]);
    expect(workflow.selectedDate).toBeNull();
    expect(workflow.resultLoading).toBe(false);
  });
});
