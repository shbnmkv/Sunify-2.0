import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import GrafikPage from './pages/GrafikPage';
import SettingPage from './pages/SettingPage'; // <== Tambahkan ini
import BottomNavBar from './components/BottomNavBar';

import '@fontsource/poppins';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/grafik" element={<GrafikPage />} />
          <Route path="/setting" element={<SettingPage />} /> {/* <== Tambahkan ini */}
        </Routes>
        <BottomNavBar />
      </div>
    </Router>
  );
}

export default App;
