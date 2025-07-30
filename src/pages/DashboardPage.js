import React, { useState, useEffect } from 'react';
import CardDisplay from '../components/CardDisplay';
import BatteryBar from '../components/BatteryBar';
import {
  FaBolt,
  FaTachometerAlt,
  FaThermometerHalf,
  FaTint,
  FaPlug
} from 'react-icons/fa';
import '@fontsource/poppins';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './Dashboard.css';
import { loadMQTTConfig } from '../config/mqttConfig';

const { backendUrl } = loadMQTTConfig();

// Cek apakah sekarang siang (05:00–17:59).
const isDaytimeNow = () => {
  const hour = new Date().getHours();
  return hour >= 5 && hour < 18;
};

function DashboardPage() {
  const [latest, setLatest] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const userName = 'Bani';

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now);
    const hour = now.getHours();
    if (hour >= 5 && hour < 11) setGreeting('Selamat Pagi');
    else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang');
    else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  const fetchLatest = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/latest`);
      const json = await res.json();
      setLatest(json);
    } catch (err) {
      console.error('Gagal fetch /api/latest:', err);
    }
  };

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isDaytime = isDaytimeNow();
  const imageUrl = isDaytime ? '/images/sun.png' : '/images/moon.png';

  const backgroundIconStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '150px',
    height: '150px',
    backgroundImage: `url('${imageUrl}')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    opacity: isDaytime ? 0.3 : 0.2,
    filter: isDaytime ? 'brightness(0.85)' : 'none',
    zIndex: 0,
    pointerEvents: 'none',
  };

  return (
    <div className="dashboard-section">
      <h2>Dashboard Panel Surya</h2>

      {/* Greeting card */}
      <div
        className="greeting-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: isDaytime
            ? 'linear-gradient(135deg, #eef3fd, #f4f8ff)'
            : 'linear-gradient(135deg, #1e1e2f, #2a2e3f)',
          color: isDaytime ? '#333' : '#f0f0f0',
          backdropFilter: !isDaytime ? 'blur(6px)' : 'none',
          border: !isDaytime ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Gambar dekoratif */}
        <div style={backgroundIconStyle}></div>

        {/* Wrapper teks greeting */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3>{greeting}, {userName}!</h3>
          <p>{formattedDate} • {formattedTime}</p>
        </div>
      </div>

      {latest ? (
        <>
          <div className="row two-columns">
            <CardDisplay
              label="Tegangan"
              value={latest.voltage?.toFixed(2)}
              unit="V"
              icon={<FaPlug />}
            />
            <CardDisplay
              label="Arus"
              value={latest.current?.toFixed(0)}
              unit="mA"
              icon={<FaBolt />}
            />
          </div>

          <div className="row one-column">
            <CardDisplay
              label="Daya"
              value={latest.power?.toFixed(2)}
              unit="W"
              icon={<FaTachometerAlt />}
            />
          </div>

          <div className="row two-columns">
            <CardDisplay
              label="Suhu"
              value={latest.suhu}
              unit="°C"
              icon={<FaThermometerHalf />}
            />
            <CardDisplay
              label="Kelembapan"
              value={latest.kelembapan}
              unit="%"
              icon={<FaTint />}
            />
          </div>

          <div className="row one-column">
            <BatteryBar percentage={latest.battery_capacity} />
          </div>
        </>
      ) : (
        <p>Loading data sensor...</p>
      )}
    </div>
  );
}

export default DashboardPage;
