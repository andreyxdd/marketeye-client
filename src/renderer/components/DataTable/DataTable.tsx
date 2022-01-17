import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import useAppContext from '../../context/useAppContext';
import { columnsDefinition, columnsToShow } from './columnsDefenition';
import processData from './dataProcessing';

const DataTable = () => {
  const { dataToPresent, dataType, dataIsLoaded } = useAppContext();
  const [columns, setColumns] = useState(columnsDefinition);
  const [pageSize, setPageSize] = useState<number>(10);

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
      <>
        <DataGrid
          rows={processData(dataToPresent[dataType], dataType)}
          columns={columns}
          autoHeight
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pageSize={pageSize}
        />
      </>
    );
  }

  return <SkeletonLoader style={{ width: '100%', minHeight: 630 }} />;
};

export default DataTable;
