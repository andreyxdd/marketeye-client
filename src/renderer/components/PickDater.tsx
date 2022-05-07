import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import shallow from 'zustand/shallow';
import useStore, { IStore } from '../hooks/useStore';

const PickDater = () => {
  const [selectedDate, setSelectedDate, availableDates] = useStore(
    (state: IStore) => [
      state.selectedDate,
      state.setSelectedDate,
      state.availableDates,
    ],
    shallow
  );

  const handleChange = (newValue: Date | null) => {
    if (newValue !== null) {
      setSelectedDate(newValue.toISOString().split('T')[0]);
    }
  };

  const disableDates = (d: Date) => {
    return !availableDates.includes(d.toISOString().split('T')[0]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Select Date"
        value={
          new Date(selectedDate).getTime() +
          new Date(selectedDate).getTimezoneOffset() * 60000
        }
        onChange={handleChange}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} style={{ width: 200 }} />
        )}
        shouldDisableDate={disableDates}
      />
    </LocalizationProvider>
  );
};

export default PickDater;
