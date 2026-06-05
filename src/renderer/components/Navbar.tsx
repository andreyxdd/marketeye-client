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
import { displayName } from '../../config/brand';
import { isTO } from '../../config/market';
import ModalForm from './ModalForm';
import useStore from '../hooks/useStore';

const Navbar = () => {
  const criterion = useStore((state) => state.criterion);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    newCriterion: ICriteria
  ) => {
    e.preventDefault();
    useStore.setState({ criterion: newCriterion });
  };

  const renderCriterionButton = (label: string, value: ICriteria) => {
    const active = criterion === value;
    if (isTO) {
      return (
        <Button
          variant={active ? 'outlined' : 'text'}
          color={active ? 'secondary' : 'inherit'}
          sx={{ mr: 2 }}
          onClick={(e) => handleClick(e, value)}
        >
          {label}
        </Button>
      );
    }
    return (
      <Button
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore — inherit variant is legacy MUI usage in this app
        variant={active ? 'outlined' : 'inherit'}
        color="inherit"
        sx={{ mr: 2 }}
        onClick={(e) => handleClick(e, value)}
      >
        {label}
      </Button>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <RemoveRedEyeIcon
              sx={isTO ? { color: 'secondary.main' } : undefined}
            />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {displayName}
          </Typography>
          {renderCriterionButton('1-day Money Flow', 'one_day_avg_mf')}
          {renderCriterionButton('3-day Money Flow', 'three_day_avg_mf')}
          {renderCriterionButton('MACD', 'macd')}
          {renderCriterionButton('1-day Volume', 'volume')}
          {renderCriterionButton('3-day Volume', 'three_day_avg_volume')}
          <Button
            variant="contained"
            color={isTO ? 'secondary' : 'inherit'}
            sx={
              isTO
                ? { mr: 2 }
                : { mr: 2, bgcolor: 'common.white', color: 'primary.main' }
            }
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
