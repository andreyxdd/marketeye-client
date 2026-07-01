import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IDataProps } from 'types';
import useStore from '../renderer/hooks/useStore';
import {
  GridColumnVisibilityModel,
  visibilityFromCriterion,
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

function allColumnsVisibleModel(): GridColumnVisibilityModel {
  return Object.fromEntries(
    columnsDefinition.map((column) => [column.field, true])
  );
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

  it('hiding one column after show-all keeps other macd session columns visible', () => {
    const afterShowAll = allColumnsVisibleModel();
    const afterToggle: GridColumnVisibilityModel = {
      ...afterShowAll,
      one_day_avg_mf: false,
    };
    expect(afterToggle.macd_2_sessions_ago).toBe(true);
    expect(afterToggle.macd_5_sessions_ago).toBe(true);
    expect(afterToggle.macd_20_sessions_ago).toBe(true);
    expect(afterToggle.one_day_avg_mf).toBe(false);
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
    expect(container.querySelectorAll('.MuiDataGrid-row').length).toBeGreaterThan(
      0
    );
  });
});
