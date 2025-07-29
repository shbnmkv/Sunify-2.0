// src/components/SettingPage.jsx
import React, { useState, useEffect } from 'react';
import { saveMQTTConfig, loadMQTTConfig } from '../config/mqttConfig';

function SettingPage() {
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [backendUrl, setBackendUrl] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const config = loadMQTTConfig();
    setIp(config.ip);
    setPort(config.port);
    setBackendUrl(config.backendUrl);
  }, []);

  const handleSave = () => {
    if (!ip || !port || !backendUrl) {
      alert('Semua field harus diisi.');
      return;
    }

    saveMQTTConfig({ ip, port, backendUrl });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">MQTT Configuration</h2>

      <label className="block mb-2">MQTT Broker IP</label>
      <input
        className="w-full border p-2 rounded mb-4"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="e.g. 192.168.1.100"
      />

      <label className="block mb-2">MQTT Broker Port</label>
      <input
        className="w-full border p-2 rounded mb-4"
        value={port}
        onChange={(e) => setPort(e.target.value)}
        placeholder="e.g. 1883"
        type="number"
      />

      <label className="block mb-2">Backend URL</label>
      <input
        className="w-full border p-2 rounded mb-4"
        value={backendUrl}
        onChange={(e) => setBackendUrl(e.target.value)}
        placeholder="e.g. http://143.198.85.152:5000"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        Simpan
      </button>

      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded mt-4">
          ✅ Konfigurasi berhasil disimpan!
        </div>
      )}
    </div>
  );
}

export default SettingPage;
