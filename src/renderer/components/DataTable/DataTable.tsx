import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import useAppContext from '../../context/useAppContext';
import { columnsDefinition, columnsToShow } from './columnsDefenition';
import processData from './dataProcessing';

const DataTable = () => {
  const { dataToPresent, dataType, dataIsLoaded } = useAppContext();
  const [columns, setColumns] = useState(columnsDefinition);

  useEffect(() => {
    const newColumns = columns.map((column) => {
      if (!columnsToShow[dataType].includes(column.field)) {
        return { ...column, hide: true };
      }
      return { ...column, hide: false };
    });

    setColumns(newColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType]);

  if (dataIsLoaded && dataToPresent !== null) {
    return (
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={processData(dataToPresent[dataType], dataType)}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 500 }}>
      <SkeletonLoader style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default DataTable;
