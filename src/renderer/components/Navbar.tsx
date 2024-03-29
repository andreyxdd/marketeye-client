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
import { ICriteria } from 'types';
import ModalForm from './ModalForm';
import useStore from '../hooks/useStore';

const Navbar = () => {
  const criterion = useStore((state) => state.criterion);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    newCriterion: ICriteria
  ) => {
    e.preventDefault();
    useStore.setState({ criterion: newCriterion });
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
            variant={criterion === 'one_day_avg_mf' ? 'outlined' : 'inherit'}
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'one_day_avg_mf')}
          >
            1-day Money Flow
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={criterion === 'three_day_avg_mf' ? 'outlined' : 'inherit'}
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'three_day_avg_mf')}
          >
            3-day Money Flow
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={criterion === 'macd' ? 'outlined' : 'inherit'}
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'macd')}
          >
            MACD
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={criterion === 'volume' ? 'outlined' : 'inherit'}
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'volume')}
          >
            1-day Volume
          </Button>
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            variant={
              criterion === 'three_day_avg_volume' ? 'outlined' : 'inherit'
            }
            color="inherit"
            sx={{ mr: 2 }}
            onClick={(e) => handleClick(e, 'three_day_avg_volume')}
          >
            3-day Volume
          </Button>
          <Button
            style={{ backgroundColor: 'white' }}
            sx={{ mr: 2 }}
            onClick={handleOpen}
          >
            Report a Problem
          </Button>
          <ModalForm open={open} setOpen={setOpen} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
