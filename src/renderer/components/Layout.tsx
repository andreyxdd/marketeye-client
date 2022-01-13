import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import Navbar from './Navbar';
import useAppContext from '../context/useAppContext';
import { IDataProps } from '../../types';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { setData } = useAppContext();

  const handleClick = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    const response: IDataProps | null =
      await window.electronAPI.getTickerAnalytics({
        date: '2021-12-29',
        ticker: 'AAPL',
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
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h2">Hello</Typography>
      <Button variant="outlined" onClick={handleClick}>
        <span role="img" aria-label="books">
          📚
        </span>
        Read our docs
      </Button>
      <Container sx={{ mt: 4, mb: 4 }} maxWidth="xl">
        {children}
      </Container>
    </div>
  );
};

export default Layout;
