import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './Map';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';


function App() {
  return (
    <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<Map />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement).render(<App />);

