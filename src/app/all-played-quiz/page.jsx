"use client"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { XCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const AllPlayedQuiz = () => {
  const [detailedAnalytics, setDetailedAnalytics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [questionsPerPage] = useState(10)

  const auth = useSelector((state) => state.auth)

  useEffect(() => {
    console.log("auth.userId", auth.userId)
    const fetchDetailedAnalytics = async () => {
      try {
        // Updated API call to fixed route without userId param
        const response = await axios.get(`/api/quizess/all-quiz-analysis`, { withCredentials: true })
        setDetailedAnalytics(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching detailed quiz analytics:", error);
        setError("Error fetching detailed quiz analytics")
        setLoading(false)
      }
    }

    if (auth?.userId) {
      fetchDetailedAnalytics()
    }
  }, [auth?.userId])

  const indexOfLastQuestion = currentPage * questionsPerPage
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage
  const currentQuestions = detailedAnalytics.slice(indexOfFirstQuestion, indexOfLastQuestion)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderOption = (option, index, correctAnswer, choose_option) => {
    const selected = index + 1 == choose_option
    const correct = index == correctAnswer

    return (
      <div
        key={index}
        className={`w-full h-[4rem] flex justify-between my-2 items-center border-2 border-gray-300 rounded-xl px-6 cursor-pointer transition-colors duration-300 
                ${selected ? (correct ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500") : ""} 
                ${correct && !selected ? "bg-green-100 border-green-500" : ""}`}
      >
        <div className="flex gap-5">
          <input type="radio" name="option" checked={selected} readOnly />
          <p className="font-semibold text-[.9rem] text-blue-700">{option}</p>
        </div>
  {selected && !correct && <XCircle className="h-5 w-5 text-red-500" />}
  {correct && <CheckCircle2 className="h-5 w-5 text-green-600" />}
      </div>
    )
  }

  const renderDetailedAnalytics = (data, index) => (
    <div className="p-4 bg-gray-200 w-full mb-4 rounded-md shadow-md" key={index}>
      <div className="text-sm flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <span className="text-black font-bold">Quiz #{index + 1}</span>
          <span
            className={`px-3 py-1 font-medium rounded-md ${
              data.choose_option - 1 === data.correctAnswer ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {data.choose_option - 1 === data.correctAnswer ? "Correct" : "Incorrect"}
          </span>
        </div>
        <span>{new Date(data.created_at).toLocaleDateString("en-GB")}</span>
      </div>
      <div className="mt-3 text-gray-800">
        <p>
          <strong>Question:</strong> {data.question}
        </p>
        <ul className="list-none">{data.options.map((option, idx) => renderOption(option, idx, data.correctAnswer, data.choose_option))}</ul>
        <p className="my-5">
          <strong>Explanation:</strong> {data.explanation}
        </p>
      </div>
    </div>
  )

  if (loading) return <div className="text-center mt-36">Loading...</div>
  if (error) return <div className="text-center mt-36 text-red-600">{error}</div>
  if (!auth?.userId) return <div className="text-center mt-36">Please log in to view your quiz history.</div>

  const totalPages = Math.ceil(detailedAnalytics.length / questionsPerPage)

  return (
    <div className="flex flex-col items-center mt-36">
      {detailedAnalytics.length === 0 && (
        <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded shadow-md text-center">
          <p className="text-gray-800 text-lg font-semibold">No quiz played yet</p>
          <div className="mt-6">
          <Link href="/quizzes" className="px-16 py-4 font-medium rounded-xl text-white bg-blue-600 hover:bg-sky-500 transition-all duration-500 inline-block">
            Play Quiz
          </Link>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl">{currentQuestions.map(renderDetailedAnalytics)}</div>

      {detailedAnalytics.length > 0 && (
        <div className="mt-4 text-center">
          <Link href="/quizzes" onClick={scrollToTop} className="px-7 py-2 mb-8 font-medium rounded-xl text-white bg-blue-600 hover:bg-sky-500 transition-all duration-500 inline-block">
            Play More Quiz
          </Link>

          <nav className="mt-4">
            <ul className="flex justify-center list-none">
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1}>
                  <button
                    onClick={() => {
                      scrollToTop()
                      paginate(i + 1)
                    }}
                    className={`mx-1 px-3 py-1 border rounded-md ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

export default AllPlayedQuiz
