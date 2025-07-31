import React, { useEffect, useState } from 'react';
import VoltageChart from '../components/VoltageChart';
import CurrentChart from '../components/CurrentChart';

import '@fontsource/poppins';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import './GrafikPage.css';
import { loadMQTTConfig } from '../config/mqttConfig';

const { backendUrl } = loadMQTTConfig();

function GrafikPage() {
  const [range, setRange] = useState('1m');
  const [historyData, setHistoryData] = useState([]);

  const downsample = (data, interval = 1) => {
    return data.filter((_, index) => index % interval === 0);
  };

  const DOWNSAMPLE_INTERVAL = {
    '1m': 1,
    '15m': 2,
    '1h': 3,
    '6h': 5,
    '12h': 8,
    '24h': 12,
    '7d': 20,
    '30d': 40,
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/history?range=${range}`);
        const json = await res.json();
        setHistoryData(json);
      } catch (err) {
        console.error('Gagal fetch /api/history:', err);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 5000
    );
    return () => clearInterval(interval);
  }, [range]);

  const interval = DOWNSAMPLE_INTERVAL[range] || 1;
  const sampledData = downsample(historyData, interval);

  return (
    <div className="grafik-page">
      <h2>Grafik Tegangan & Arus</h2>

      {/* Switch filter waktu */}
      <div className="time-switch">
        {[
          { label: '1M', value: '1m' },
          { label: '15M', value: '15m' },
          { label: '1H', value: '1h' },
          { label: '24H', value: '24h' },
          { label: '1W', value: '7d' }
        ].map((option) => {
          const isActive = range === option.value;
          return (
            <button
              key={option.value + (isActive ? '-active' : '')}
              className={`time-pill ${isActive ? 'active' : ''}`}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Grafik */}
      <div className="chart-container">
        <div className="chart-card">
          <h4>Grafik Tegangan</h4>
          <VoltageChart data={sampledData} />
        </div>
        <div className="chart-card">
          <h4>Grafik Arus</h4>
          <CurrentChart data={sampledData} />
        </div>
      </div>

      <div className="bottom-spacer" />
    </div>
  );
}

export default GrafikPage;
