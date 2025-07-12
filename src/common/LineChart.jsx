'use client';

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js components only once, and only on the client side
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
}

export default function LineChart({ dailyResults }) {
  dailyResults = Array.isArray(dailyResults) ? dailyResults : [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Initialize arrays with zeros for all days in the month
  const correctCounts = Array.from({ length: daysInMonth }, () => 0);
  const wrongCounts = Array.from({ length: daysInMonth }, () => 0);

  dailyResults.forEach((result) => {
    const dayIndex = result.day - 1; // Adjust for 0-based array index
    if (dayIndex >= 0 && dayIndex < daysInMonth) {
      correctCounts[dayIndex] = parseInt(result.correct_count, 10);
      wrongCounts[dayIndex] = parseInt(result.wrong_count, 10);
    }
  });

  const data = {
    labels: Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()), // Labels for each day (1 to 31)
    datasets: [
      {
        label: "Correct Question", // Changed label to match the image
        data: correctCounts,
        fill: true,
        backgroundColor: "rgba(84,174,71,0.2)",
        borderColor: "#54ae47",
        tension: 0.4,
      },
      {
        label: "Wrong Question", // Changed label to match the image
        data: wrongCounts,
        fill: true,
        backgroundColor: "rgba(56,83,164,0.2)",
        borderColor: "#3853a4",
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          color: '#e0e0e0'
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
        title: {
          display: true,
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        beginAtZero: true,
        max: 14,
        ticks: {
          stepSize: 2,
        },
        grid: {
          display: true,
          color: '#e0e0e0'
        },
        title: {
          font: { size: 14, weight: 'bold' }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top', // Position legend at the top
        align: 'center', // Align legend items to the center
        labels: {
          usePointStyle: true, // Use colored squares/rectangles for legend items as seen in the image
          boxWidth: 16, // Adjust box width to be more rectangular like in the image
          padding: 20 // Padding between legend items
        }
      },
      title: {
        display: true,
        font: {
          size: 20,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            if (context.dataset.label === 'Correct Question') {
              return `Correct Answers: ${context.parsed.y}`;
            } else if (context.dataset.label === 'Wrong Question') {
              return `Wrong Answers: ${context.parsed.y}`;
            }
            return context.parsed.y;
          }
        }
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
  };

  return (
    <div className="h-[320px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}