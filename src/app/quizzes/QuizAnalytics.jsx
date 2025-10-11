// components/QuizAnalytics.jsx
import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import axios from "axios";

const QuizAnalytics = ({ analyticUpdate, userId = null }) => {
  const [analytics, setAnalytics] = useState({
    currentDay: [],
    currentWeek: [],
    currentMonth: [],
    currentYear: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `/api/quizess/current-quiz-analysis?userId=${userId}`
        );
        setAnalytics(response.data);
      } catch (error) {
        setError("Error fetching quiz analytics");
        console.error("Error fetching quiz analytics:", error);
      }
    };
    fetchAnalytics();
  }, [analyticUpdate, userId]);

  const renderAnalytics = (data, title) => {
    const correctPercentage = parseFloat(data?.correct_percentage);
    return (
      <div className="bg-white  transition-shadow duration-300  p-6 w-full sm:max-w-[340px] border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            Analytics
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <Check className="h-4 w-4" /> Correct:{" "}
            <span className="text-gray-800 font-normal">{data.correct_count}</span>
          </div>

          <div className="flex items-center gap-2 text-red-500 font-medium justify-end">
            <X className="h-4 w-4" /> Incorrect:{" "}
            <span className="text-gray-800 font-normal">{data.wrong_count}</span>
          </div>

          <div className="col-span-2 flex items-center gap-2 text-gray-700">
            <span className="font-medium">Total:</span> {data.total_count}
          </div>

          <div className="col-span-2 flex items-center gap-2 text-gray-700">
            <span className="font-medium">Accuracy:</span>{" "}
            <span
              className={`font-bold ${correctPercentage > 80
                  ? "text-green-600"
                  : correctPercentage > 50
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
            >
              {correctPercentage?.toFixed(2) ?? "0.00"}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (!userId) return <div className="text-center text-gray-500">No user selected.</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-6 px-4">
      {analytics.currentDay.length > 0 &&
        renderAnalytics(analytics.currentDay[0], "Today")}
      {analytics.currentWeek.length > 0 &&
        renderAnalytics(analytics.currentWeek[0], "This Week")}
      {analytics.currentMonth.length > 0 &&
        renderAnalytics(analytics.currentMonth[0], "This Month")}
      {analytics.currentYear.length > 0 &&
        renderAnalytics(analytics.currentYear[0], "This Year")}
    </div>
  );
};

export default QuizAnalytics;
