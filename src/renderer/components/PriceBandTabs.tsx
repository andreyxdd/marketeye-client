import { Tabs, Tab, Box } from '@mui/material';
import shallow from 'zustand/shallow';
import {
  PriceBand,
  PRICE_BANDS,
  priceBandLabel,
} from '../../config/priceBands';
import useStore from '../hooks/useStore';

function PriceBandTabs() {
  const priceBand = useStore((state) => state.priceBand, shallow);

  const handleChange = (_event: React.SyntheticEvent, newBand: PriceBand) => {
    useStore.setState({ priceBand: newBand });
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4 }}>
      <Tabs
        value={priceBand}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {PRICE_BANDS.map((band) => (
          <Tab key={band} label={priceBandLabel(band)} value={band} />
        ))}
      </Tabs>
    </Box>
  );
}

export default PriceBandTabs;
