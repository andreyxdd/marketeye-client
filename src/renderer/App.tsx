import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@mui/material';
import Layout from './components/Layout';
import DataTable from './components/DataTable';

import { IDataProps } from '../types';

const MainComponent = () => {
  const [dataArray, setDataArray] = useState<Array<IDataProps> | null>([]);
  const [dataType, setDataType] = useState<string>('by_one_day_avg_mf');

  const handleClick = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    const response: Array<IDataProps> | null =
      await window.electronAPI.getTickerAnalytics({
        date: '2021-12-29',
        ticker: 'TSLA',
      });

    setDataArray(response);
  };

  return (
    <>
      <Layout dataType={dataType} setDataType={setDataType}>
        <Button variant="outlined" onClick={handleClick}>
          <span role="img" aria-label="books">
            📚
          </span>
          Read our docs
        </Button>
        <DataTable dataArray={dataArray} />
      </Layout>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainComponent />} />
      </Routes>
    </Router>
  );
}
