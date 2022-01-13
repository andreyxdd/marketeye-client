import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface INavbarProps {
  dataType: string;
  setDataType: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar = ({ dataType, setDataType }: INavbarProps) => {
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    NewDataType: string
  ) => {
    e.preventDefault();
    setDataType(NewDataType);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <RemoveRedEyeIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MarketEye
          </Typography>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={dataType === 'by_one_day_avg_mf' ? 'outlined' : 'inherit'}
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'by_one_day_avg_mf')}
          >
            1-day Money Flow
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={
              dataType === 'by_three_day_avg_mf' ? 'outlined' : 'inherit'
            }
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'by_three_day_avg_mf')}
          >
            3-day Money Flow
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={
              dataType === 'by_five_prec_open_close_change'
                ? 'outlined'
                : 'inherit'
            }
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'by_five_prec_open_close_change')}
          >
            5% change
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={dataType === 'by_volume' ? 'outlined' : 'inherit'}
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'by_volume')}
          >
            1-day Volume
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={
              dataType === 'by_three_day_avg_volume' ? 'outlined' : 'inherit'
            }
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'by_three_day_avg_volume')}
          >
            3-day Volume
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
