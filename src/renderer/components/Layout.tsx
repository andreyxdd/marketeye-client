import {
  Container,
  Button,
  Grid,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import Navbar from './Navbar';
import MarketDataGridItem from './MarketDataGridItem';
import PickDater from './PickDater';
import useAppContext from '../context/useAppContext';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { textField, setTextField, dataType } = useAppContext();

  const handleSearchStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = (e.target as HTMLInputElement).value;
    setTextField({
      ...textField,
      searchString: currentValue.toUpperCase(),
      helperText: '',
      error: false,
      on: false,
    });
  };

  const handleSearch = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (textField.searchString) {
      setTextField({
        ...textField,
        on: true,
      });
    } else {
      setTextField({
        ...textField,
        helperText: 'Input is empty',
        error: true,
      });
    }
  };

  const handleSearchClear = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setTextField({
      ...textField,
      searchString: '',
      on: false,
    });
  };

  const handleDataTypeTitle = (type: string) => {
    if (textField.on) {
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
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          xs={3}
          spacing={1}
        >
          <Grid item>
            <TextField
              size="small"
              label="Search for ticker"
              inputProps={{ maxLength: 5 }}
              onChange={handleSearchStringChange}
              value={textField.searchString}
              helperText={textField.helperText}
              error={textField.error}
              style={{ width: 150 }}
            />
          </Grid>
          <Grid item>
            <Button
              style={{ width: 70, height: 35 }}
              size="small"
              variant="contained"
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{ width: 70, height: 35 }}
              size="small"
              variant="outlined"
              color="error"
              onClick={handleSearchClear}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        <Grid container item xs={6}>
          <Grid item container xs={12} justifyContent="center" sx={{ mb: 1 }}>
            <Typography variant="h6">Market-as-a-whole Analytics</Typography>
          </Grid>
          <MarketDataGridItem />
        </Grid>
        <Grid
          item
          xs={3}
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <PickDater />
        </Grid>
      </Grid>
      <Divider />
      <Container sx={{ mt: 4 }} maxWidth="xl">
        <Typography variant="h6" sx={{ mb: 3, mt: 2 }}>
          {handleDataTypeTitle(dataType)}
        </Typography>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
