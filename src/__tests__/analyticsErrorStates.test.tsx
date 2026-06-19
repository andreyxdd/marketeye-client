import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import DataTable from '../renderer/components/DataTable';
import MarketDataGridItem from '../renderer/components/MarketDataGridItem';
import Table from '../renderer/components/DataTable/Table';
import useManyTickers from '../renderer/hooks/useManyTickers';
import useSingleTicker from '../renderer/hooks/useSingleTicker';
import useMarketData from '../renderer/hooks/useMarketData';
import useStore from '../renderer/hooks/useStore';

jest.mock('../renderer/hooks/useManyTickers');
jest.mock('../renderer/hooks/useSingleTicker');
jest.mock('../renderer/hooks/useMarketData');

const flavorMatrix = [
  'standard-us',
  'standard-to',
  'micro-us',
  'micro-to',
] as const;

const mockedUseManyTickers = useManyTickers as jest.MockedFunction<
  typeof useManyTickers
>;
const mockedUseSingleTicker = useSingleTicker as jest.MockedFunction<
  typeof useSingleTicker
>;
const mockedUseMarketData = useMarketData as jest.MockedFunction<
  typeof useMarketData
>;

describe('Table analytics error UI', () => {
  it('shows MUI Alert with Retry when isError', () => {
    const refetch = jest.fn();
    render(
      <Table
        data={undefined}
        isFetching={false}
        isError
        error={new Error('Service unavailable')}
        refetch={refetch}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Service unavailable');
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});

describe.each(flavorMatrix)(
  'many tickers error UI (%s)',
  (flavor) => {
    it('shows retry alert when list query fails', () => {
      const refetch = jest.fn();
      useStore.setState({ isSingleTicker: false });
      mockedUseManyTickers.mockReturnValue({
        data: undefined,
        isFetching: false,
        isError: true,
        error: new Error(`${flavor} analytics failed`),
        refetch,
      } as unknown as ReturnType<typeof useManyTickers>);

      render(<DataTable />);

      expect(screen.getByRole('alert')).toHaveTextContent(
        `${flavor} analytics failed`
      );
      fireEvent.click(screen.getByRole('button', { name: /retry/i }));
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  }
);

describe('market panel error UI (US flavors)', () => {
  it('shows retry alert when market query fails', () => {
    const refetch = jest.fn();
    mockedUseMarketData.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
      error: new Error('market analytics failed'),
      refetch,
    } as unknown as ReturnType<typeof useMarketData>);

    render(<MarketDataGridItem />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'market analytics failed'
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});

describe('single ticker error UI', () => {
  it('shows retry alert when ticker query fails', () => {
    const refetch = jest.fn();
    useStore.setState({ isSingleTicker: true });
    mockedUseSingleTicker.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
      error: new Error('ticker analytics failed'),
      refetch,
    } as unknown as ReturnType<typeof useSingleTicker>);

    render(<DataTable />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'ticker analytics failed'
    );
  });
});
