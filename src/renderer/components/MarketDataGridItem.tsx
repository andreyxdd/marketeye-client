import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import useAppContext from '../context/useAppContext';
import { IMarketDataProps } from '../../types';

const MarketDataGridItem = () => {
  const { date } = useAppContext();
  const [marketData, setMarketData] = useState<IMarketDataProps>({});

  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      if (date) {
        try {
          const response: IMarketDataProps | null =
            await window.electronAPI.getMarketAnalytics({
              date,
            });

          if (response) {
            setMarketData(response);
          }
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [date]);

  if (marketData !== null) {
    return (
      <Grid
        item
        container
        direction="row"
        alignItems="space-evenly"
        xs={12}
        spacing={1}
      >
        {/* SP500 and VIX1 column */}
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          xs={2}
        >
          <Grid item>
            <Typography variant="body2">SP500:</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">VIX1:</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          xs={2}
        >
          <Grid item>{(marketData.SP500 as number).toFixed(2)}</Grid>
          <Grid item>{(marketData.VIX1 as number).toFixed(2)}</Grid>
        </Grid>

        {/* CVI and VIX2 column */}
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          xs={2}
        >
          <Grid item>
            <Typography variant="body2">CVI:</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">VIX2:</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          xs={2}
        >
          <Grid item>
            {((marketData.normalazied_CVI_slope as number) * 100).toPrecision(
              4
            )}
          </Grid>

          <Grid item>{(marketData.VIX2 as number).toFixed(2)}</Grid>
        </Grid>

        {/* VIX and VIX_avg_50 column */}
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          xs={2}
        >
          <Grid item>
            <Typography variant="body2">VIX:</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">VIX 50-EMA:</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          xs={2}
        >
          <Grid item>{(marketData.VIX as number).toFixed(2)}</Grid>
          <Grid item>{(marketData.VIX_50days_EMA as number).toFixed(2)}</Grid>
        </Grid>
      </Grid>
    );
  }

  return <div>No available market data</div>;
};

export default MarketDataGridItem;
