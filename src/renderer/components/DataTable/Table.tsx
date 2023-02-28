import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import { IDataProps } from 'types';
import useStore from '../../hooks/useStore2';
import { columnsDefinition, columnsToShow } from './columnsDefenition';
import processData from './dataProcessing';

type IDataTable = {
  data: Array<IDataProps> | undefined;
  isFetching: boolean;
};

const DataTable = ({ data, isFetching }: IDataTable) => {
  const criterion = useStore((state) => state.criterion);

  const [columns, setColumns] = React.useState(columnsDefinition);
  const [pageSize, setPageSize] = React.useState<number>(10);

  React.useEffect(() => {
    const newColumns = columns.map((column) => {
      if (!columnsToShow[criterion].includes(column.field)) {
        return { ...column, hide: true };
      }
      return { ...column, hide: false };
    });

    setColumns(newColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criterion]);

  if (data && !isFetching) {
    return (
      <>
        <DataGrid
          rows={processData(data, criterion)}
          columns={columns}
          autoHeight
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pageSize={pageSize}
        />
      </>
    );
  }

  return (
    <SkeletonLoader
      style={{ width: '100%', minHeight: 630, position: 'absolute' }}
    />
  );
};

export default DataTable;
