// src/components/BottomNavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartLine, FaCog } from 'react-icons/fa';

import './BottomNavBar.css';

function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        <FaHome size={20} />
        <span>Dashboard</span>
      </Link>
      
      <Link to="/grafik" className={location.pathname === '/grafik' ? 'active' : ''}>
        <FaChartLine size={20} />
        <span>Grafik</span>
      </Link>
      
      <Link to="/setting" className={location.pathname === '/setting' ? 'active' : ''}>
        <FaCog size={20} />
        <span>Setting</span>
      </Link>
    </nav>
  );
}

export default BottomNavBar;
