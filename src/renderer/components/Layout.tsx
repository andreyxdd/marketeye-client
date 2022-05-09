import {
  Container,
  Button,
  Grid,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import shallow from 'zustand/shallow';
import Navbar from './Navbar';
import MarketDataGridItem from './MarketDataGridItem';
import PickDater from './PickDater';
import Footer from './Footer';
import useStore, { IStore } from '../hooks/useStore';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const [
    dataType,
    currentDataIsLoaded,
    fetchAndSetOneTickerData,
    showOneTickerData,
    setTextfield,
    textField,
    clearTextfield,
    manyTickersDataIsLoaded,
  ] = useStore(
    (state: IStore) => [
      state.dataType,
      state.currentDataIsLoaded,
      state.fetchAndSetOneTickerData,
      state.showOneTickerData,
      state.setTextfield,
      state.textfield,
      state.clearTextfield,
      state.manyTickersDataIsLoaded,
    ],
    shallow
  );

  const handleSearchStringChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = (e.target as HTMLInputElement).value;
    setTextfield({
      searchString: currentValue.toUpperCase(),
      helperText: '',
      error: false,
    });
  };

  const handleSearchStart = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    await fetchAndSetOneTickerData();
  };

  const handleSearchClear = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    clearTextfield();
  };

  const handleDataTypeTitle = (type: string) => {
    if (showOneTickerData) {
      return `Analytics for the ${textField.searchString} ticker`;
    }

    switch (type) {
      case 'by_three_day_avg_mf':
        return 'Top 20 stocks by 3-day average money flow';
      case 'by_five_prec_open_close_change':
        return 'Top stocks that overcame 5% change between open and close prices';
      case 'by_volume':
        return 'Top 20 stocks by 1-day volume';
      case 'by_three_day_avg_volume':
        return 'Top 20 stocks by 3-day average volume';
      default:
        return 'Top 20 stocks by 1-day money flow';
    }
  };

  return (
    <div>
      <Navbar />
      <Grid
        sx={{ pl: 4, pr: 4, pt: 4, pb: 2 }}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          container
          justifyContent="flex-start"
          alignItems="center"
          xs={3.5}
          spacing={1}
        >
          <Grid item>
            <TextField
              size="small"
              label="Search for tickers"
              inputProps={{ maxLength: 5, style: { fontSize: 16 } }}
              onChange={handleSearchStringChange}
              value={textField.searchString}
              helperText={textField.helperText}
              error={textField.error}
              style={{ width: 120 }}
              InputLabelProps={{ style: { fontSize: 12 } }}
              disabled={
                !currentDataIsLoaded ||
                (currentDataIsLoaded &&
                  !showOneTickerData &&
                  !manyTickersDataIsLoaded)
              }
            />
          </Grid>
          <Grid item>
            <Button
              style={{ width: 65, height: 35, marginRight: 4 }}
              size="small"
              variant="contained"
              onClick={handleSearchStart}
              disabled={
                !currentDataIsLoaded ||
                (currentDataIsLoaded &&
                  !showOneTickerData &&
                  !manyTickersDataIsLoaded)
              }
            >
              Search
            </Button>
            <Button
              style={{ width: 65, height: 35, marginLeft: 4 }}
              size="small"
              variant="outlined"
              color="error"
              onClick={handleSearchClear}
              disabled={
                !currentDataIsLoaded ||
                (currentDataIsLoaded &&
                  !showOneTickerData &&
                  !manyTickersDataIsLoaded)
              }
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        <Grid container item xs={5}>
          <Grid
            item
            container
            xs={12}
            justifyContent="center"
            sx={{ mb: 1, pl: 15 }}
          >
            <Typography variant="h6" sx={{ fontSize: 18 }}>
              Market-as-a-whole Analytics
            </Typography>
          </Grid>
          <MarketDataGridItem />
        </Grid>
        <Grid
          item
          xs={3.5}
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <PickDater />
        </Grid>
      </Grid>
      <Divider />
      <Container maxWidth="xl" style={{ minHeight: 630 }}>
        <Typography variant="h6" sx={{ mb: 1, mt: 2, fontSize: 16 }}>
          {handleDataTypeTitle(dataType)}
        </Typography>
        <div style={{ width: '100%', minHeight: 630, marginBottom: 20 }}>
          {children}
        </div>
        <Footer />
      </Container>
    </div>
  );
};

export default Layout;
