import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import DataTable from './components/DataTable';
import './App.css';

const MainComponent = () => {
  return (
    <Layout>
      <DataTable />
    </Layout>
  );
};

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainComponent />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
