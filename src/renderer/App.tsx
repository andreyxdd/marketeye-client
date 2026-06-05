import { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { documentTitle } from '../config/brand';
import { getAppTheme } from '../config/theme';
import Layout from './components/Layout';
import DataTable from './components/DataTable';
import './App.css';

const appTheme = getAppTheme();

const MainComponent = () => {
  return (
    <Layout>
      <DataTable />
    </Layout>
  );
};

const queryClient = new QueryClient();
export default function App() {
  useEffect(() => {
    document.title = documentTitle;
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<MainComponent />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
