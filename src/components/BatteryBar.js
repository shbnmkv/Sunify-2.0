import React from 'react';
import { FaBatteryFull } from 'react-icons/fa';
import './Card.css';
import './BatteryBar.css';

const BatteryBar = ({ percentage }) => {
  const getColor = () => {
    if (percentage >= 80) return '#4caf50'; // hijau
    if (percentage >= 50) return '#ff9800'; // oranye
    return '#f44336'; // merah
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <FaBatteryFull size={20} color={getColor()} />
        <h3 style={{ margin: 0 }}>Baterai</h3>
      </div>

      <div style={{
        width: '100%',
        height: 20,
        backgroundColor: '#e5e7eb',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: getColor(),
          transition: 'width 0.3s ease'
        }} />
      </div>

      <p style={{
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        color: getColor()
      }}>
        {percentage}%
      </p>
    </div>
  );
};

export default BatteryBar;
