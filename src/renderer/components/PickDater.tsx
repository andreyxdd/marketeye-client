import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import useStore from '../hooks/useStore2';
import useDates from '../hooks/useDates';

const PickDater = () => {
  const selectedDate = useStore((state) => state.selectedDate);
  const { data: availableDates, isLoading } = useDates();

  const handleChange = (newValue: Date | null) => {
    if (newValue !== null) {
      const date = newValue.toISOString().split('T')[0];
      useStore.setState({ selectedDate: date });
    }
  };

  if (!availableDates || !selectedDate)
    return <SkeletonLoader style={{ width: 200, height: 50 }} />;

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
        loading={isLoading}
      />
    </LocalizationProvider>
  );
};

export default PickDater;
