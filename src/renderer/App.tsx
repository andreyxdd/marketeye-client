import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DataTable from './components/DataTable/DataTable';
import AppContextProvider from './context/AppContextProvider';
import './App.css';

const MainComponent = () => {
  return (
    <AppContextProvider>
      <Layout>
        <DataTable />
      </Layout>
    </AppContextProvider>
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
