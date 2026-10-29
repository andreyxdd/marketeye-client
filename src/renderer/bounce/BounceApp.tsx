import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useBounceWorkflow, { BounceWorkflow } from './useBounceWorkflow';
import { BouncePriceRange } from './types';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Rank', width: 70 },
  { field: 'ticker', headerName: 'Ticker', flex: 0.7 },
  { field: 'open', headerName: 'Open', type: 'number', flex: 0.8 },
  { field: 'close', headerName: 'Close', type: 'number', flex: 0.8 },
  {
    field: 'open_close_change_pct',
    headerName: 'Open–close change (%)',
    type: 'number',
    flex: 1,
    valueFormatter: ({ value }) => Number(value).toFixed(2),
  },
  { field: 'volume', headerName: 'Volume', type: 'number', flex: 0.8 },
  { field: 'frequencies', headerName: 'Frequencies', flex: 1.5 },
];

const priceRanges: Array<{ value: BouncePriceRange; label: string }> = [
  { value: 'all', label: 'All closing prices' },
  { value: '48to99_99', label: '$48–$99.99' },
  { value: '100to299_99', label: '$100–$299.99' },
  { value: '300to499_99', label: '$300–$499.99' },
  { value: '500to1000', label: '$500–$1,000' },
];

function message(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function ResultContent({ workflow }: { workflow: BounceWorkflow }) {
  if (workflow.resultError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={workflow.retryResult}>
            Retry results
          </Button>
        }
      >
        {message(workflow.resultError, 'Unable to load StockBounce results.')}
      </Alert>
    );
  }
  if (workflow.resultLoading) {
    return (
      <Alert severity="info" role="status">
        Loading StockBounce results…
      </Alert>
    );
  }
  if (workflow.result && workflow.result.rows.length === 0) {
    return (
      <Alert severity="info">
        {workflow.mode === 'tracking'
          ? 'No observations for the tracked tickers on this session. Return to the originating screen or choose another tracking date.'
          : 'No stocks match this screen. Try another lookback period or close price range.'}
      </Alert>
    );
  }
  if (workflow.result) {
    return (
      <DataGrid
        aria-label="StockBounce results"
        rows={workflow.result.rows}
        columns={columns}
        autoHeight
        disableVirtualization
        pageSize={20}
        hideFooter
        disableSelectionOnClick
      />
    );
  }
  return (
    <Alert severity="info">
      No bounce-ready sessions are available. Run publication or the historical
      backfill, then retry.
    </Alert>
  );
}

export default function BounceApp() {
  const workflow = useBounceWorkflow();

  if (workflow.sessionsLoading) {
    return (
      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="info" role="status">
          Loading sessions and bounce-ready history…
        </Alert>
      </Container>
    );
  }

  if (workflow.sessionsError) {
    return (
      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={workflow.retrySessions}>
              Retry sessions
            </Button>
          }
        >
          {message(
            workflow.sessionsError,
            'Unable to load StockBounce sessions.'
          )}
        </Alert>
      </Container>
    );
  }

  if (!workflow.sessions.length) {
    return (
      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="info"
          action={
            <Button color="inherit" onClick={workflow.retrySessions}>
              Retry sessions
            </Button>
          }
        >
          No bounce-ready sessions are available. Run publication or the
          historical backfill, then retry.
        </Alert>
      </Container>
    );
  }

  const originIndex = workflow.sessions.findIndex(
    (session) => session.date_string === workflow.selectedDate
  );
  const trackingIndex = workflow.sessions.findIndex(
    (session) => session.date_string === workflow.trackingDate
  );
  const activeTrackingOffset =
    workflow.mode === 'tracking' ? trackingIndex - originIndex : null;

  return (
    <Box component="main">
      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontSize: 28, mb: 1 }}>
          StockBounce
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 72 }}>
          Screen US open–close reversals, then follow the same tickers into the
          next retained sessions.
        </Typography>
      </Box>
      <Divider />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {workflow.trackingDate ? (
          <Typography component="h2" variant="h6" sx={{ mb: 2, fontSize: 18 }}>
            Tracking {workflow.trackingDate} (T
            {activeTrackingOffset ? `+${activeTrackingOffset}` : ''})
          </Typography>
        ) : null}
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              select
              SelectProps={{ native: true }}
              label="Session"
              value={workflow.selectedDate ?? ''}
              onChange={(event) => workflow.selectDate(event.target.value)}
              disabled={workflow.mode === 'tracking'}
            >
              {workflow.sessions.map((session) => (
                <option key={session.date_string} value={session.date_string}>
                  {session.date_string}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              select
              SelectProps={{ native: true }}
              label="Lookback period"
              value={workflow.period}
              onChange={(event) =>
                workflow.setPeriod(Number(event.target.value))
              }
              disabled={workflow.mode === 'tracking'}
            >
              {Array.from({ length: 18 }, (_, index) => index + 1).map(
                (period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                )
              )}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={5} md={3}>
            <TextField
              fullWidth
              select
              SelectProps={{ native: true }}
              label="Close price range"
              value={workflow.priceRange}
              onChange={(event) =>
                workflow.setPriceRange(event.target.value as BouncePriceRange)
              }
              disabled={workflow.mode === 'tracking'}
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[0, 1, 2].map((offset) => (
                <Button
                  key={offset}
                  variant={
                    activeTrackingOffset === offset ? 'contained' : 'outlined'
                  }
                  onClick={() => workflow.track(offset)}
                  disabled={!workflow.trackingAvailability[offset]}
                >
                  Track T{offset ? `+${offset}` : ''}
                </Button>
              ))}
              {workflow.mode === 'tracking' ? (
                <Button variant="text" onClick={workflow.returnToScreen}>
                  Back to screen
                </Button>
              ) : null}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
          {workflow.result?.coverage === 'degraded' ? (
            <Alert severity="warning">
              Degraded coverage: this historical snapshot used archived tickers
              plus the current EODHD universe and is not survivorship-free.
            </Alert>
          ) : null}
          {workflow.result?.missing_tickers.length ? (
            <Alert severity="warning">
              No observation is available for:{' '}
              {workflow.result.missing_tickers.join(', ')}.
            </Alert>
          ) : null}
          <ResultContent workflow={workflow} />
        </Box>
      </Container>
    </Box>
  );
}
