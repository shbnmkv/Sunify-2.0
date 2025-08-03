// src/config/mqttConfig.js
const STORAGE_KEY = 'mqtt_config';

export function saveMQTTConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadMQTTConfig() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    ip: '',
    port: '',
    backendUrl: '',
  };
}
