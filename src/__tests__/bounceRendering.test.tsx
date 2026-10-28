import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import BounceApp from '../renderer/bounce/BounceApp';
import useBounceWorkflow, {
  BounceWorkflow,
} from '../renderer/bounce/useBounceWorkflow';

jest.mock('../renderer/bounce/useBounceWorkflow');

const mockedHook = useBounceWorkflow as jest.MockedFunction<
  typeof useBounceWorkflow
>;

const baseResult = {
  schema_version: 1 as const,
  market: 'US' as const,
  date: '2024-01-02',
  period: 6,
  price_range: '100to299_99' as const,
  rows: [
    {
      id: 1,
      ticker: 'AAA',
      open: 100,
      close: 105,
      volume: 1000,
      open_close_change_pct: 5,
      frequencies: 'T-2, T-6',
    },
  ],
  missing_tickers: [],
  coverage: 'exact' as const,
};

function workflow(overrides: Partial<BounceWorkflow> = {}): BounceWorkflow {
  return {
    sessions: [
      { epoch: 1, date_string: '2024-01-01' },
      { epoch: 2, date_string: '2024-01-02' },
      { epoch: 3, date_string: '2024-01-03' },
    ],
    sessionsLoading: false,
    sessionsError: null,
    retrySessions: jest.fn(),
    selectedDate: '2024-01-02',
    period: 6,
    priceRange: '100to299_99',
    mode: 'screen',
    trackingDate: null,
    originTickers: [],
    result: baseResult,
    resultLoading: false,
    resultError: null,
    retryResult: jest.fn(),
    trackingAvailability: { 0: true, 1: true, 2: false },
    selectDate: jest.fn(),
    setPeriod: jest.fn(),
    setPriceRange: jest.fn(),
    track: jest.fn(),
    returnToScreen: jest.fn(),
    ...overrides,
  };
}

describe('BounceApp', () => {
  it('renders independent labelled controls and embedded frequencies', () => {
    mockedHook.mockReturnValue(workflow());
    render(<BounceApp />);

    expect(screen.getByLabelText('Session')).toHaveValue('2024-01-02');
    expect(screen.getByLabelText('Lookback period')).toHaveValue('6');
    expect(screen.getByLabelText('Close price range')).toHaveValue(
      '100to299_99'
    );
    expect(screen.getByText('T-2, T-6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Track T+2' })).toBeDisabled();
  });

  it('shows degraded coverage separately from result data', () => {
    mockedHook.mockReturnValue(
      workflow({
        mode: 'tracking',
        result: { ...baseResult, coverage: 'degraded' },
      })
    );
    render(<BounceApp />);

    expect(screen.getByRole('alert')).toHaveTextContent('Degraded coverage');
    expect(screen.getByText('AAA')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to screen' })
    ).toBeEnabled();
  });

  it('distinguishes empty results and exposes result retry', () => {
    const empty = workflow({ result: { ...baseResult, rows: [] } });
    mockedHook.mockReturnValue(empty);
    const { unmount } = render(<BounceApp />);
    expect(screen.getByText(/No stocks match/)).toBeInTheDocument();
    unmount();

    const failed = workflow({
      result: undefined,
      resultError: new Error('down'),
    });
    mockedHook.mockReturnValue(failed);
    render(<BounceApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry results' }));
    expect(failed.retryResult).toHaveBeenCalled();
  });

  it('keeps session loading and session errors distinct', () => {
    mockedHook.mockReturnValue(
      workflow({ sessionsLoading: true, result: undefined })
    );
    const { unmount } = render(<BounceApp />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading sessions');
    unmount();

    const failed = workflow({
      sessions: [],
      sessionsError: new Error('offline'),
      result: undefined,
      selectedDate: null,
    });
    mockedHook.mockReturnValue(failed);
    render(<BounceApp />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry sessions' }));
    expect(failed.retrySessions).toHaveBeenCalled();
  });
});
