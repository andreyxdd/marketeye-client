import Table from './Table';
import useStore from '../../hooks/useStore2';
import useSingleTicker from '../../hooks/useSingleTicker';
import useManyTickers from '../../hooks/useManyTickers';

function SingleTickerDataTable() {
  const { data, isFetching } = useSingleTicker();
  return <Table data={data} isFetching={isFetching} />;
}

function ManyTickersDataTable() {
  const { data, isFetching } = useManyTickers();
  return <Table data={data} isFetching={isFetching} />;
}

function DataTable() {
  const isSingleTicker = useStore((state) => state.isSingleTicker);
  if (isSingleTicker) return <SingleTickerDataTable />;
  return <ManyTickersDataTable />;
}

export default DataTable;
