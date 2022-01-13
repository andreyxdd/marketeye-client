import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IDataProps } from '../../types';

const columns: GridColDef[] = [
  { field: 'ticker', headerName: 'ticker', width: 150 },
  { field: 'macd', headerName: 'MACD', width: 150 },
  { field: 'one_day_avg_mf', headerName: 'Money Flow', width: 150 },
];

interface IDataTableProps {
  dataArray: Array<IDataProps> | null;
}

const DataTable = ({ dataArray }: IDataTableProps) => {
  if (dataArray) {
    return (
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row.ticker}
          rows={dataArray}
          columns={columns}
        />
      </div>
    );
  }

  return <div style={{ height: 300, width: '100%' }}>No data to present</div>;
};

export default DataTable;
