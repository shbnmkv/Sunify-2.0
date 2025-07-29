import React from 'react';
import './CardDisplay.css';

function CardDisplay({ label, value, unit, icon }) {
  return (
    <div className="card">
      <div className="icon">{icon}</div>
      <div className="value">
        {value} <span className="unit">{unit}</span>
      </div>
      <div className="label">{label}</div>
    </div>
  );
}

export default CardDisplay;
