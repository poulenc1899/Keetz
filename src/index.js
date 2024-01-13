import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './Map';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement).render(<App />);
