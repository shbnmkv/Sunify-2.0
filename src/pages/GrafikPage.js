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
  
  // Fungsi frontend downsampling: ambil setiap `interval` data point
  function downsample(data, interval = 1) {
    return data.filter((_, index) => index % interval === 0);
  }

  // Mapping tingkat sampling berdasarkan range
  const DOWNSAMPLE_INTERVAL = {
    '1m': 1,     // tampilkan semua
    '15m': 2,
    '1h': 3,
    '6h': 5,
    '12h': 8,
    '24h': 12,
    '7d': 20,
    '30d': 40
  };

  useEffect(() => {
    const fetchHistory = async () => {
    
      try {
        const res = await fetch(`${backendUrl}/api/history?range=${range}`);
        const json = await res.json();
        setHistoryData(json);
      } catch (err) {
        console.error('Gagal fetch /api/history:', err);
      } finally {
  
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [range]);

  // Terapkan downsampling berdasarkan range yang dipilih
  const interval = DOWNSAMPLE_INTERVAL[range] || 1;
  const sampledData = downsample(historyData, interval);

  return (
    <div className="grafik-page">
      <h2>Dashboard Panel Surya</h2>

      {/* Filter waktu */}
      <div className="time-filter">
        <label htmlFor="timeRange">Pilih Waktu : </label>
        <select
          id="timeRange"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="1m">1 Menit Terakhir</option>
          <option value="15m">15 Menit Terakhir</option>
          <option value="1h">1 Jam Terakhir</option>
          <option value="6h">6 Jam Terakhir</option>
          <option value="12h">12 Jam Terakhir</option>
          <option value="24h">24 Jam Terakhir</option>
          <option value="7d">1 Minggu Terakhir</option>
          <option value="30d">1 Bulan Terakhir</option>
        </select>
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
    </div>
  );
}

export default GrafikPage;
