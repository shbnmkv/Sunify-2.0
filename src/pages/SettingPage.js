import React, { useState, useEffect } from 'react';
import { saveMQTTConfig, loadMQTTConfig } from '../config/mqttConfig';
import './SettingPage.css';

function SettingPage() {
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const config = loadMQTTConfig();
    if (config.backendUrl) {
      try {
        const url = new URL(config.backendUrl);
        setIp(url.hostname);
        setPort(url.port);
      } catch (err) {
        console.warn('URL tidak valid di config:', config.backendUrl);
      }
    }
  }, []);

  const buildBackendUrl = () => `http://${ip}:${port}`;

  const handleSave = () => {
    if (!ip || !port) {
      alert('IP dan Port tidak boleh kosong.');
      return;
    }

    const backendUrl = buildBackendUrl();
    saveMQTTConfig({ backendUrl });
    setShowToast(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleReset = () => {
    localStorage.removeItem('mqtt_config');
    setIp('');
    setPort('');
    setTimeout(() => window.location.reload(), 1000);
    alert('Konfigurasi telah direset.');
  };

  const handleTestConnection = async () => {
    const backendUrl = buildBackendUrl();

    if (!ip || !port) {
      alert('IP dan Port belum diisi.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/ping`);
      if (response.ok) {
        setTestResult({ success: true, message: '✅ Berhasil terhubung ke backend!' });
      } else {
        setTestResult({ success: false, message: `❌ Gagal: status ${response.status}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: '❌ Tidak bisa menghubungi backend.' });
    }

    setTimeout(() => setTestResult(null), 5000);
  };

    return (
      <div className="setting-page">
        <h2>Pengaturan Backend</h2>
    
        {/* 🆕 Notifikasi muncul di atas form */}
        {showToast && (
          <div className="toast success">
            ✅ Konfigurasi berhasil disimpan!
          </div>
        )}
    
        {testResult && (
          <div className={`toast ${testResult.success ? 'success' : 'error'}`}>
            {testResult.message}
          </div>
        )}
    
        <div>
          <label>IP Backend</label>
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Contoh: 143.198.85.152"
          />
        </div>
    
        <div>
          <label>Port Backend</label>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="Contoh: 5000"
            type="number"
          />
        </div>
    
        <div className="button-group">
          <button className="btn-save" onClick={handleSave}>Simpan</button>
          <button className="btn-reset" onClick={handleReset}>Reset</button>
          <button className="btn-test" onClick={handleTestConnection}>Test Koneksi</button>
        </div>
    
        <div className="about-section">
          <h3>Tentang Aplikasi</h3>
          <p>Aplikasi monitoring panel surya ini dikembangkan oleh <strong>i-click tech</strong>.</p>
          <p>Kode sumber tersedia di GitHub: <a href="https://github.com/shbnmkv" target="_blank" rel="noopener noreferrer">shbnmkv</a></p>
          <p>Versi: 1.0.0</p>
          <p>Teknologi: ReactJS, Flask, MongoDB, MQTT</p>
          <p>Status: Beta</p>
          <p>Lisensi: MIT</p>
        </div>
      </div>
    );
    
  
}

export default SettingPage;
