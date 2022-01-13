import React from 'react';
import { Typography, Container } from '@mui/material';
import Navbar from './Navbar';

interface ILayoutProps {
  children: React.ReactNode;
  dataType: string;
  setDataType: React.Dispatch<React.SetStateAction<string>>;
}

const Layout = ({ children, dataType, setDataType }: ILayoutProps) => {
  return (
    <div>
      <Navbar dataType={dataType} setDataType={setDataType} />
      <Typography variant="h2">Hello</Typography>
      <Container sx={{ mt: 4, mb: 4 }} maxWidth="xl">
        {children}
      </Container>
    </div>
  );
};

export default Layout;
