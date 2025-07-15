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

  // Find first and last day with non-zero data to center the chart
  let firstDay = daysInMonth;
  let lastDay = 0;
  dailyResults.forEach((result) => {
    const dayIndex = result.day - 1; // Adjust for 0-based array index
    if (dayIndex >= 0 && dayIndex < daysInMonth) {
      correctCounts[dayIndex] = parseInt(result.correct_count, 10);
      wrongCounts[dayIndex] = parseInt(result.wrong_count, 10);
      if (dayIndex < firstDay) firstDay = dayIndex;
      if (dayIndex > lastDay) lastDay = dayIndex;
    }
  });

  // Validate firstDay and lastDay
  if (firstDay > lastDay) {
    // No valid data, show full month with zeros
    firstDay = 0;
    lastDay = daysInMonth - 1;
  }

  // Calculate padding to center data
  const dataLength = lastDay - firstDay + 1;
  const totalLength = daysInMonth;
  const paddingLeft = Math.floor((totalLength - dataLength) / 2);
  const paddingRight = totalLength - dataLength - paddingLeft;

  // Create padded arrays and labels
  const paddedCorrectCounts = [
    ...Array(paddingLeft).fill(0),
    ...correctCounts.slice(firstDay, lastDay + 1),
    ...Array(paddingRight).fill(0),
  ];
  const paddedWrongCounts = [
    ...Array(paddingLeft).fill(0),
    ...wrongCounts.slice(firstDay, lastDay + 1),
    ...Array(paddingRight).fill(0),
  ];
  const paddedLabels = [
    ...Array(paddingLeft).fill(''),
    ...Array(dataLength).fill(null).map((_, i) => (firstDay + i + 1).toString()),
    ...Array(paddingRight).fill(''),
  ];

  const data = {
    labels: paddedLabels, // Labels adjusted to center data
    datasets: [
  {
    label: "Correct Answers",
    data: paddedCorrectCounts,
    fill: true,
    backgroundColor: "rgba(84,174,71,0.2)",
    borderColor: "#54ae47",
    tension: 0.4,
    pointRadius: 3,              // reduced from 5
    pointHoverRadius: 5,         // reduced from 7
    pointBackgroundColor: "#54ae47",
    pointBorderColor: "#54ae47",
  },
  {
    label: "Wrong Answer",
    data: paddedWrongCounts,
    fill: true,
    backgroundColor: "rgba(56,83,164,0.2)",
    borderColor: "#3853a4",
    tension: 0.4,
    pointRadius: 3,              // reduced from 5
    pointHoverRadius: 5,         // reduced from 7
    pointBackgroundColor: "#3853a4",
    pointBorderColor: "#3853a4",
  },
]

  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        offset: true,
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
          boxWidth: 20, // Slightly larger box width
          padding: 20, // Padding between legend items
          color: '#000', // Black text color for legend labels
          // Removed generateLabels to fix runtime error
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
            if (context.dataset.label === 'Correct Answers') {
              return `Correct Answers: ${context.parsed.y}`;
            } else if (context.dataset.label === 'Wrong Answer') {
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