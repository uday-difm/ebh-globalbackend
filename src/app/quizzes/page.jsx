"use client";
import React, { useState } from "react";

const quizData = [
  {
    question: "What is the process by which groundwater is replenished?",
    options: [
      "Evaporation",
      "Transpiration",
      "Infiltration",
      "Condensation",
    ],
  },
];

export default function QuizPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-white flex text-black flex-col items-center">
      <h1 className="text-5xl font-bold mt-6  pt-26 mb-2 text-center">Quiz</h1>
      <p className="text-lg font-semibold text-center mb-8">
        Test your knowledge and gain valuable insights
      </p>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1300px] px-4 mx-auto">
        {/* Question Section */}
        <div className="bg-gray-50 rounded-xl shadow-md flex-1 p-10 flex flex-col justify-center min-h-[320px]">
          <div>
            <span className="font-bold text-lg text-black px-4 py-2 ">
              Question:
            </span>
            <p className="mt-8 text-lg font-medium text-gray-800">
              {quizData[0].question}
            </p>
          </div>
        </div>
        {/* Options Section */}
        <div className="bg-white rounded-xl shadow-md flex-1 p-10 flex flex-col justify-between min-h-[320px]">
          <form className="flex flex-col gap-6">
            {quizData[0].options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center border rounded-lg px-6 py-4 cursor-pointer transition
                  ${selected === idx
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400"}
                `}
              >
                <input
                  type="radio"
                  name="option"
                  className="form-radio h-5 w-5 text-blue-600"
                  checked={selected === idx}
                  onChange={() => setSelected(idx)}
                />
                <span className="ml-4 text-base font-semibold text-gray-600">
                  {option}
                </span>
              </label>
            ))}
          </form>
          <button
            className="self-end mt-8 bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            type="button"
          >
            Next
          </button>
        </div>
      </div>
      <h2 className="text-5xl font-bold text-blue-800 mt-20 mb-8 text-center">
        Track Your Score
      </h2>

    </div>

  );
}