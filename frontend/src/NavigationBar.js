import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartLine } from 'react-icons/fa';


function NavigationBar() {
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        <FaHome />
        <span>Dashboard</span>
      </Link>
      <Link to="/chart" className={location.pathname === '/chart' ? 'active' : ''}>
        <FaChartLine />
        <span>Grafik</span>
      </Link>
    </div>
  );
}

export default NavigationBar;
