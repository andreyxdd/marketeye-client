import { useState, useEffect, useContext } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import useAppContext from 'renderer/context/useAppContext';
import { IDateProps } from 'types';

const PickDater = () => {
  const { date, setDate } = useAppContext();

  const handleChange = (newValue: Date | null) => {
    setDate(newValue);
  };

  const [availableDates, setAvailableDates] = useState<Array<string>>([]);
  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function () {
      const response: Array<IDateProps> = await window.electronAPI.getDates();
      const datesArray = response.map(({ date_string }) => date_string);
      const nDates = datesArray.length;

      setAvailableDates(datesArray);

      if (nDates > 0) {
        setDate(new Date(datesArray[nDates - 1]));
      } else {
        setDate(null);
      }
    })();
  }, [setDate]);

  const disableDates = (d: Date) => {
    return !availableDates.includes(d.toISOString().split('T')[0]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Select Date"
        value={date}
        onChange={handleChange}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} />}
        shouldDisableDate={disableDates}
      />
    </LocalizationProvider>
  );
};

export default PickDater;
