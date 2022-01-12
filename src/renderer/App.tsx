import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

// @ts-expect-error: electron is globally defined during runtime
const ipcRenderer = electron.conn;

const Hello = () => {
  const [macd, setMacd] = useState<number>(0);

  const handleClick = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    const result = await ipcRenderer.getTickerAnalytics({
      date: '2021-12-29',
      ticker: 'TSLA',
    });

    setMacd(result);
  };

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <button type="button" onClick={handleClick}>
          <span role="img" aria-label="books">
            🙏
          </span>
          Donate
        </button>
      </div>

      <p style={{ textAlign: 'center' }}>TSLA MACD: {macd}</p>
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
