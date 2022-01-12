import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Typography } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import SampleButton from './components/SampleButton';
import icon from '../../assets/icon.svg';
import './App.css';

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
];

const Hello = () => {
  const [macd, setMacd] = useState<number>(0);
  const [showDataGrid, setShowDataGrid] = useState<boolean>(false);

  const handleClick = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    const result = await window.electronAPI.getTickerAnalytics({
      date: '2021-12-29',
      ticker: 'TSLA',
    });

    setMacd(result);

    setShowDataGrid((b) => !b);
  };

  return (
    <div>
      {showDataGrid ? (
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      ) : (
        <>
          <div className="Hello">
            <img width="200px" alt="icon" src={icon} />
          </div>
          <Typography variant="h4">electron-react-boilerplate</Typography>
          <div className="Hello">
            <SampleButton />
            <button type="button" onClick={handleClick}>
              <span role="img" aria-label="books">
                🙏
              </span>
              Donate
            </button>
          </div>

          <p style={{ textAlign: 'center' }}>TSLA MACD: {macd}</p>
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
