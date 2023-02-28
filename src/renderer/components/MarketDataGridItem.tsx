import { Grid, Typography } from '@mui/material';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import useMarketData from '../hooks/useMarketData';

const MarketDataGridItem = () => {
  const { data: marketData, isFetching } = useMarketData();

  if (marketData && !isFetching) {
    return (
      <Grid
        item
        container
        direction="row"
        alignItems="space-evenly"
        xs={12}
        spacing={0.5}
      >
        {/* SP500 and VIX1 column */}
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          xs={3}
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              SP500:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              VIX-1:
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          xs={1}
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2">
              {(marketData.SP500 as number).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              {(marketData.VIX1 as number).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        {/* CVI and VIX2 column */}
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          xs={3}
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              CVI:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              VIX-2:
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          xs={1}
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2">
              {((marketData.normalazied_CVI_slope as number) * 100).toPrecision(
                4
              )}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="body2">
              {(marketData.VIX2 as number).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        {/* VIX and VIX_avg_50 column */}
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          xs={3}
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              VIX:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              VIX 50-EMA:
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          xs={1}
          spacing={1}
        >
          <Grid item>
            <Typography variant="body2">
              {(marketData.VIX as number).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              {(marketData.VIX_50days_EMA as number).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  // if fetching or 'null'
  return (
    <Grid
      item
      container
      justifyContent="center"
      sx={{ mb: 1, pl: 15 }}
      style={{ width: '100%', height: 40 }}
    >
      <SkeletonLoader style={{ width: '100%', height: '100%' }} />
    </Grid>
  );
};

export default MarketDataGridItem;
