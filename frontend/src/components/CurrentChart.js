// src/components/CurrentChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function CurrentChart({ data, range }) {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Arus (mA)',
        data: data.map(d => d.current),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.15)',
        tension: 0.3,
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  // Tentukan unit dan format berdasarkan rentang waktu
  let timeUnit = 'minute';
  let displayFormat = 'HH:mm';
  let tooltipFormat = 'dd MMM yyyy HH:mm';

  switch (range) {
    case '1m':
      timeUnit = 'minute';
      displayFormat = 'HH:mm';
      break;
    case '15m':
    case '1h':
    case '24h':
      timeUnit = 'hour';
      displayFormat = 'HH:mm';
      break;
    case '7d':
      timeUnit = 'day';
      displayFormat = 'dd MMM';
      break;
    default:
      timeUnit = 'minute';
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
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
        callbacks: {
          label: function (context) {
            const date = new Date(context.parsed.x);
            const current = context.parsed.y;
            return `${date.toLocaleString('id-ID')} - ${current} mA`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeUnit,
          displayFormats: {
            [timeUnit]: displayFormat,
          },
          tooltipFormat,
        },
        ticks: {
          maxRotation: 45,
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
