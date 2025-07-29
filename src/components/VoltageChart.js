// src/components/VoltageChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function VoltageChart({ data }) {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Tegangan (V)',
        data: data.map(d => d.voltage),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.15)',
        tension: 0.3,
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2, // Grafik tidak terlalu tinggi
    layout: {
      padding: 10, // Tambah ruang
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        ticks: {
          maxTicksLimit: 6,
          font: { size: 10 },
        },
        title: {
          display: true,
          text: 'Waktu (WIB)',
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          font: { size: 10 },
        },
        title: {
          display: false,
          text: 'Voltase (V)',
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default VoltageChart;
