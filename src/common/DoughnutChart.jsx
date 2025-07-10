'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DoughnutChart = ({ data = [0, 0] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const labels = ['Correct Question', 'Wrong Question'];

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['#54ae47', '#3853a4'],
            cutout: '80%',
            radius: '75%',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', height: '300px', width: '300px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default DoughnutChart;
