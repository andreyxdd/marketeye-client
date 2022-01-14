import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useAppContext from '../context/useAppContext';

const columns: GridColDef[] = [
  { field: 'ticker', headerName: 'ticker', width: 150 },
  { field: 'macd', headerName: 'MACD', width: 150 },
  { field: 'one_day_avg_mf', headerName: 'Money Flow', width: 150 },
];

const DataTable = () => {
  const { dataToPresent } = useAppContext();

  if (dataToPresent) {
    return (
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.ticker}
          rows={dataToPresent.by_one_day_avg_mf}
          columns={columns}
        />
      </div>
    );
  }

  return <div style={{ height: 300, width: '100%' }}>No data to present</div>;
};

export default DataTable;
