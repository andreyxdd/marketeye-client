import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DataTable from './components/DataTable/DataTable';
import './App.css';
import useStore, { IStore } from './hooks/useStore';

const MainComponent = () => {
  const onMountFetch = useStore((state: IStore) => state.onMountFetch);

  React.useEffect(() => {
    onMountFetch();
  }, [onMountFetch]);

  return (
    <Layout>
      <DataTable />
    </Layout>
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
