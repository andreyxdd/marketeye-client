import Table from './Table';
import useStore from '../../hooks/useStore';
import useSingleTicker from '../../hooks/useSingleTicker';
import useManyTickers from '../../hooks/useManyTickers';

function SingleTickerDataTable() {
  const { data, isFetching, isError, error, refetch } = useSingleTicker();
  return (
    <Table
      data={data}
      isFetching={isFetching}
      isError={isError}
      error={error}
      refetch={refetch}
    />
  );
}

function ManyTickersDataTable() {
  const { data, isFetching, isError, error, refetch } = useManyTickers();
  return (
    <Table
      data={data}
      isFetching={isFetching}
      isError={isError}
      error={error}
      refetch={refetch}
    />
  );
}

function DataTable() {
  const isSingleTicker = useStore((state) => state.isSingleTicker);
  if (isSingleTicker) return <SingleTickerDataTable />;
  return <ManyTickersDataTable />;
}

export default DataTable;
