import { Alert, Button } from '@mui/material';
import React from 'react';
import {
  DataGrid,
  GridApiRef,
  GridColumnVisibilityChangeParams,
  GridFooter,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import { ICriteria, IDataProps } from 'types';
import useStore from '../../hooks/useStore';
import { columnsDefinition, columnsToShow } from './columnsDefenition';
import processData from './dataProcessing';

export type GridColumnVisibilityModel = Record<string, boolean>;

export function visibilityFromCriterion(
  criterion: ICriteria
): GridColumnVisibilityModel {
  const shown = new Set(columnsToShow[criterion]);
  return Object.fromEntries(
    columnsDefinition.map((column) => [column.field, shown.has(column.field)])
  );
}

export function visibilityModelFromGridColumns(
  columns: ReadonlyArray<{ field: string; hide?: boolean }>
): GridColumnVisibilityModel {
  return Object.fromEntries(columns.map(({ field, hide }) => [field, !hide]));
}

export function visibilityModelFromApiRef(
  apiRef: GridApiRef
): GridColumnVisibilityModel {
  return visibilityModelFromGridColumns(
    columnsDefinition.map(({ field }) => {
      const column = apiRef.current.getColumn(field);
      return { field, hide: column.hide };
    })
  );
}

function ColumnVisibilityApiBridge({ apiRef }: { apiRef: GridApiRef }) {
  const gridApiRef = useGridApiContext();

  React.useLayoutEffect(() => {
    if (gridApiRef.current) {
      apiRef.current = gridApiRef.current;
    }
  });

  return null;
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
  const apiRef = useGridApiRef();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    React.useState<GridColumnVisibilityModel>(() =>
      visibilityFromCriterion(criterion)
    );
  const [pageSize, setPageSize] = React.useState<number>(10);

  React.useEffect(() => {
    setColumnVisibilityModel(visibilityFromCriterion(criterion));
  }, [criterion]);

  // ponytail: MUI v5 has no columnVisibilityModel prop — map model → hide until upgrade
  const columns = React.useMemo(
    () =>
      columnsDefinition.map((column) => ({
        ...column,
        hide: !columnVisibilityModel[column.field],
      })),
    [columnVisibilityModel]
  );

  const handleColumnVisibilityChange = React.useCallback(
    (_params: GridColumnVisibilityChangeParams) => {
      queueMicrotask(() => {
        if (!apiRef.current) return;
        setColumnVisibilityModel(visibilityModelFromApiRef(apiRef));
      });
    },
    [apiRef]
  );

  const footerComponents = React.useMemo(
    () => ({
      Footer: () => (
        <>
          <GridFooter />
          <ColumnVisibilityApiBridge apiRef={apiRef} />
        </>
      ),
    }),
    [apiRef]
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
          components={footerComponents}
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
