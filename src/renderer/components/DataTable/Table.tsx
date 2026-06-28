import { Alert, Button } from '@mui/material';
import React from 'react';
import { DataGrid, GridColDef, GridColumnVisibilityChangeParams } from '@mui/x-data-grid';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import { ICriteria, IDataProps } from 'types';
import useStore from '../../hooks/useStore';
import { columnsDefinition, columnsToShow } from './columnsDefenition';
import processData from './dataProcessing';

export function columnsForCriterion(criterion: ICriteria): GridColDef[] {
  return columnsDefinition.map((column) => ({
    ...column,
    hide: !columnsToShow[criterion].includes(column.field),
  }));
}

type IDataTable = {
  data: Array<IDataProps> | undefined;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Failed to load analytics data.';
}

const DataTable = ({
  data,
  isFetching,
  isError,
  error,
  refetch,
}: IDataTable) => {
  const criterion = useStore((state) => state.criterion);

  const [columns, setColumns] = React.useState(() =>
    columnsForCriterion(criterion)
  );
  const [pageSize, setPageSize] = React.useState<number>(10);

  React.useEffect(() => {
    setColumns(columnsForCriterion(criterion));
  }, [criterion]);

  const handleColumnVisibilityChange = React.useCallback(
    (params: GridColumnVisibilityChangeParams) => {
      setColumns((prev) =>
        prev.map((column) =>
          column.field === params.field
            ? { ...column, hide: !params.isVisible }
            : column
        )
      );
    },
    []
  );

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {errorMessage(error)}
      </Alert>
    );
  }

  if (data && !isFetching) {
    return (
      <>
        <DataGrid
          rows={processData(data, criterion)}
          columns={columns}
          autoHeight
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          pageSize={pageSize}
        />
      </>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: 630, position: 'relative' }}>
      <SkeletonLoader
        style={{ width: '100%', minHeight: 630, position: 'absolute' }}
      />
    </div>
  );
};

export default DataTable;
