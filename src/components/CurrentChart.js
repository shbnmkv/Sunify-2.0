// src/components/CurrentChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function CurrentChart({ data }) {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Arus (mA)',
        data: data.map(d => d.current),
        borderColor: '#10b981', // Warna hijau
        backgroundColor: 'rgba(16,185,129,0.15)',
        tension: 0.3,
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2, // Sama seperti VoltageChart
    layout: {
      padding: 10,
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
          unit: 'hour', // Sama seperti VoltageChart
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
          text: 'Arus (mA)',
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

export default CurrentChart;
