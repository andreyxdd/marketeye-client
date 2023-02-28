import {
  Container,
  Button,
  Grid,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import shallow from 'zustand/shallow';
import { ICriteria } from 'types';
import Navbar from './Navbar';
import MarketDataGridItem from './MarketDataGridItem';
import PickDater from './PickDater';
import Footer from './Footer';
import useStore from '../hooks/useStore';
import useManyTickers from '../hooks/useManyTickers';
import useSingleTicker from '../hooks/useSingleTicker';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { isFetching: isManyFetching } = useManyTickers();
  const { isFetching: isOneFetching } = useSingleTicker();
  const [criterion, textfield, isSingleTicker] = useStore(
    (state) => [state.criterion, state.textfield, state.isSingleTicker],
    shallow
  );

  const handleSearchStringChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = (e.target as HTMLInputElement).value;
    if (!isSingleTicker && currentValue) {
      useStore.setState({
        textfield: {
          searchString: currentValue.toUpperCase(),
          helperText: '',
          error: false,
        },
      });
    }
  };

  const handleSearchStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (textfield.searchString) {
      useStore.setState({ isSingleTicker: true });
    } else {
      useStore.setState({
        textfield: {
          searchString: textfield.searchString,
          helperText: 'Incorrect input',
          error: true,
        },
      });
    }
  };

  const handleSearchClear = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    useStore.setState({
      isSingleTicker: false,
      textfield: { searchString: '', helperText: '', error: false },
    });
  };

  const displayCriterionTitle = (newCriterion: ICriteria) => {
    if (isSingleTicker) {
      return `Analytics for the ${textfield.searchString} ticker`;
    }

    switch (newCriterion) {
      case 'three_day_avg_mf':
        return 'Top 20 stocks by 3-day average money flow';
      case 'volume':
        return 'Top 20 stocks by 1-day volume';
      case 'three_day_avg_volume':
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
              value={textfield.searchString}
              helperText={textfield.helperText}
              error={textfield.error}
              style={{ width: 120 }}
              InputLabelProps={{ style: { fontSize: 12 } }}
              disabled={isOneFetching || isManyFetching || isSingleTicker}
            />
          </Grid>
          <Grid item>
            <Button
              style={{ width: 65, height: 35, marginRight: 4 }}
              size="small"
              variant="contained"
              onClick={handleSearchStart}
              disabled={isOneFetching || isManyFetching}
            >
              Search
            </Button>
            <Button
              style={{ width: 65, height: 35, marginLeft: 4 }}
              size="small"
              variant="outlined"
              color="error"
              onClick={handleSearchClear}
              disabled={isOneFetching || isManyFetching}
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
          {displayCriterionTitle(criterion)}
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
