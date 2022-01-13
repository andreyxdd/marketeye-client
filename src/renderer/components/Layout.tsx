import { useState } from 'react';
import {
  Typography,
  Container,
  Button,
  Grid,
  Divider,
  TextField,
} from '@mui/material';
import Navbar from './Navbar';
import PickDater from './PickDater';
import useAppContext from '../context/useAppContext';
import { IDataProps } from '../../types';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { date, setData } = useAppContext();

  const [searchString, setSearchString] = useState<string>('');

  const handleSearchStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = (e.target as HTMLInputElement).value;
    setSearchString(currentValue);
  };

  const handleSearch = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (date) {
      const offset = date.getTimezoneOffset();
      const dateUTC = new Date(date.getTime() - offset * 60 * 1000);

      const response: IDataProps | null =
        await window.electronAPI.getTickerAnalytics({
          date: dateUTC.toISOString().split('T')[0],
          ticker: searchString,
        });

      if (response) {
        setData({
          by_one_day_avg_mf: [response],
          by_three_day_avg_mf: [response],
          by_five_prec_open_close_change: [response],
          by_volume: [response],
          by_three_day_avg_volume: [response],
        });
      }
    }
  };

  const handleClear = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
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
              helperText={false && 'Hellow'}
              onChange={handleSearchStringChange}
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
              onClick={handleClear}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Hello</Typography>
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
        {children}
      </Container>
    </div>
  );
};

export default Layout;
