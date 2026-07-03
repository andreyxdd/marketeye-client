import '@testing-library/jest-dom';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridApiRef,
  GridFooter,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid';
import { IDataProps } from 'types';
import useStore from '../renderer/hooks/useStore';
import {
  GridColumnVisibilityModel,
  visibilityFromCriterion,
  visibilityModelFromApiRef,
  visibilityModelFromGridColumns,
} from '../renderer/components/DataTable/Table';
import { columnsDefinition } from '../renderer/components/DataTable/columnsDefenition';

const baseRow: IDataProps = {
  ticker: 'AAPL',
  date: 1,
  macd: 0.1,
  macd_2_sessions_ago: 0.2,
  macd_5_sessions_ago: 0.3,
  macd_20_sessions_ago: 0.4,
  one_day_avg_mf: 1000,
  three_day_avg_mf: 2000,
  one_day_open_close_change: 0.01,
  volume: 500000,
  three_day_avg_volume: 400000,
  one_day_volume_change: 0.02,
  three_day_avg_volume_change: 0.03,
  one_day_close_change: 0.04,
  three_day_avg_close_change: 0.05,
  ema_3over9: ['A'],
  ema_12over9: ['B'],
  ema_12over26: ['A'],
  ema_50over20: ['B'],
  closingPriceChangeDay12: 0.01,
  closingPriceChangeDay23: 0.02,
  mfi: 50,
  ema3: 1,
  ema9: 2,
  ema12: 3,
  ema20: 4,
  ema26: 5,
  ema50: 6,
  mentions_over_one_day: 1,
  mentions_over_two_days: 2,
  mentions_over_three_days: 3,
  fcf: '100',
  frequencies: '2024-01',
};

function gridColumnsAfterShowAll() {
  return columnsDefinition.map((column) => ({
    field: column.field,
    hide: false,
  }));
}

function mergeSingleFieldVisibility(
  model: GridColumnVisibilityModel,
  field: string,
  isVisible: boolean
): GridColumnVisibilityModel {
  return { ...model, [field]: isVisible };
}

describe('tableColumnVisibility', () => {
  it('visibilityFromCriterion hides fields outside the active criterion preset', () => {
    useStore.setState({ criterion: 'macd' });
    const model = visibilityFromCriterion('macd');
    expect(model.volume).toBe(false);
    expect(model.macd).toBe(true);
  });

  it('visibilityFromCriterion resets from columnsDefinition when criterion changes', () => {
    const volumeModel = visibilityFromCriterion('volume');
    expect(volumeModel.volume).toBe(true);
    expect(volumeModel.macd_20_sessions_ago).toBe(false);
  });

  it('visibilityModelFromGridColumns syncs full grid state after show-all', () => {
    const preset = visibilityFromCriterion('one_day_avg_mf');
    const synced = visibilityModelFromGridColumns(gridColumnsAfterShowAll());
    const staleMerge = mergeSingleFieldVisibility(
      preset,
      'one_day_avg_mf',
      false
    );

    expect(synced.macd_2_sessions_ago).toBe(true);
    expect(synced.macd_5_sessions_ago).toBe(true);
    expect(synced.macd_20_sessions_ago).toBe(true);
    expect(staleMerge.macd_2_sessions_ago).toBe(false);
  });

  it('visibilityModelFromGridColumns keeps macd columns visible after show-all then hide one', () => {
    const afterToggle = gridColumnsAfterShowAll().map((column) =>
      column.field === 'one_day_avg_mf' ? { ...column, hide: true } : column
    );
    const model = visibilityModelFromGridColumns(afterToggle);

    expect(model.macd_2_sessions_ago).toBe(true);
    expect(model.macd_5_sessions_ago).toBe(true);
    expect(model.macd_20_sessions_ago).toBe(true);
    expect(model.one_day_avg_mf).toBe(false);
  });

  it('renders rows when all columns visible and close is missing', () => {
    const columns: GridColDef[] = columnsDefinition.map((c) => ({
      ...c,
      hide: false,
    }));
    const { container } = render(
      <div style={{ width: 1200, height: 400 }}>
        <DataGrid
          rows={[{ ...baseRow, id: 1 }]}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>
    );
    expect(
      container.querySelectorAll('.MuiDataGrid-row').length
    ).toBeGreaterThan(0);
  });
});

function ColumnVisibilityApiBridge({ apiRef }: { apiRef: GridApiRef }) {
  const gridApiRef = useGridApiContext();

  React.useLayoutEffect(() => {
    if (gridApiRef.current) {
      apiRef.current = gridApiRef.current;
    }
  });

  return null;
}

describe('tableColumnVisibility integration', () => {
  let gridApiRef: GridApiRef | null = null;

  function VisibilitySyncHarness() {
    const apiRef = useGridApiRef();
    gridApiRef = apiRef;
    const [model, setModel] = React.useState<GridColumnVisibilityModel>(() =>
      visibilityFromCriterion('one_day_avg_mf')
    );
    const columns = React.useMemo(
      () =>
        columnsDefinition.map((column) => ({
          ...column,
          hide: !model[column.field],
        })),
      [model]
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

    return (
      <div style={{ width: 1200, height: 400 }}>
        <DataGrid
          rows={[{ ...baseRow, id: 1 }]}
          columns={columns}
          components={footerComponents}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10]}
          onColumnVisibilityChange={() => {
            queueMicrotask(() => {
              if (!apiRef.current) return;
              setModel(visibilityModelFromApiRef(apiRef));
            });
          }}
        />
      </div>
    );
  }

  it('syncs full model from apiRef after show-all bulk update and single toggle', async () => {
    gridApiRef = null;
    render(<VisibilitySyncHarness />);

    await waitFor(() => expect(gridApiRef?.current).toBeTruthy());

    await act(async () => {
      gridApiRef!.current!.updateColumns(
        columnsDefinition.map((column) => ({ ...column, hide: false }))
      );
    });

    await act(async () => {
      gridApiRef!.current!.setColumnVisibility('one_day_avg_mf', false);
    });

    await waitFor(() => {
      const model = visibilityModelFromApiRef(gridApiRef!);
      expect(model.macd_2_sessions_ago).toBe(true);
      expect(model.macd_5_sessions_ago).toBe(true);
      expect(model.macd_20_sessions_ago).toBe(true);
      expect(model.one_day_avg_mf).toBe(false);
    });
  });
});
