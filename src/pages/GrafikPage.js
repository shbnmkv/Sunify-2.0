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
    return Array.isArray(data) ? data.filter((_, index) => index % interval === 0) : [];
  };

  const DOWNSAMPLE_INTERVAL = {
    '1m': 1,
    '15m': 2,
    '1h': 4,
    '24h': 6,
    '7d': 20,
  };

  const rangeToMs = (range) => {
    const map = {
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    };
    return map[range] || 15 * 60 * 1000;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (range === '1m') {
          // Realtime
          const res = await fetch(`${backendUrl}/api/history?range=1m`);
          const json = await res.json();
          setHistoryData(json);
        } else {
          // Snapshot
          const now = new Date();
          const end = now.toISOString();
          const start = new Date(now - rangeToMs(range)).toISOString();
          const res = await fetch(`${backendUrl}/api/history_range?start=${start}&end=${end}`);
          const json = await res.json();
          setHistoryData(json);
        }
      } catch (err) {
        console.error('Gagal fetch history:', err);
        setHistoryData([]);
      }
    };

    fetchHistory();

    let interval;
    if (range === '1m') {
      interval = setInterval(fetchHistory, 5000);
    }

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
              key={option.value}
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
          <VoltageChart data={sampledData} range={range} />
        </div>
        <div className="chart-card">
          <h4>Grafik Arus</h4>
          <CurrentChart data={sampledData} range={range} />
        </div>
      </div>

      <div className="bottom-spacer" />
    </div>
  );
}

export default GrafikPage;
