import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import useAppContext from '../context/useAppContext';

const PickDater = () => {
  const { date, setDate, availableDates } = useAppContext();

  const handleChange = (newValue: Date | null) => {
    if (newValue !== null) {
      setDate(newValue.toISOString().split('T')[0]);
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
          new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60000
        }
        onChange={handleChange}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} style={{ width: 300 }} />
        )}
        shouldDisableDate={disableDates}
      />
    </LocalizationProvider>
  );
};

export default PickDater;
