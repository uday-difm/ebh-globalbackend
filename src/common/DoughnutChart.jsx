'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DoughnutChart = ({ data = [0, 0], total = 0 }) => {
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
            {/* Centered stats overlay */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
            }}>
                <div style={{ fontWeight: 'bold', fontSize: 22 }}>All Question</div>
                <div style={{ fontWeight: 'bold', fontSize: 32 }}>{total}</div>
                <div style={{ fontSize: 14, color: '#54ae47', marginTop: 4 }}>Correct: {data[0]}</div>
                <div style={{ fontSize: 14, color: '#3853a4' }}>Wrong: {data[1]}</div>
            </div>
        </div>
    );
};

export default DoughnutChart;
