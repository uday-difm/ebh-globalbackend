"use client";

import React, { useState, useEffect } from "react";
import Quiz from "@/common/Quiz";
import { User, LogOut, Lock, Mail, Shield, Award, HelpCircle } from "lucide-react";

export default function QuizzesPage() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login"); // "login" | "signup"
  
  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyticUpdate, setAnalyticUpdate] = useState(0);

  useEffect(() => {
    // Load logged-in quiz user from localStorage
    const savedUser = localStorage.getItem("quiz_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("quiz_user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("quiz_user");
    setUser(null);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const payload = authTab === "login" 
      ? { action: "login", username, password }
      : { action: "register", name, username, email, password };

    try {
      const res = await fetch("/api/quizess/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("quiz_user", JSON.stringify(data.user));
      setUser(data.user);
      setShowAuthModal(false);
      
      // Clear inputs
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-black py-28 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1200px] flex flex-col gap-6">
        
        {/* Header bar with user profile / login action */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            <span className="font-bold text-lg text-slate-800">EBH Quiz Hub</span>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                  <User className="h-3.5 w-3.5" />
                  Hi, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTab("login");
                  setShowAuthModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition"
              >
                Log In to Play
              </button>
            )}
          </div>
        </div>

        {/* Quiz Container */}
        {user ? (
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-md border border-slate-100 min-h-[400px] flex flex-col justify-center">
            <Quiz userId={user.id} setAnalyticUpdate={setAnalyticUpdate} />
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center text-center max-w-lg mx-auto mt-10">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <HelpCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Ready to test your knowledge?</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              Sign up or log in to play our environmental and sustainability quizzes. Track your progress and compete!
            </p>
            <div className="flex gap-4 mt-8 w-full">
              <button
                onClick={() => {
                  setAuthTab("login");
                  setShowAuthModal(true);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthTab("signup");
                  setShowAuthModal(true);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-md transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
            
            {/* Modal Tabs */}
            <div className="grid grid-cols-2 border-b">
              <button
                onClick={() => {
                  setAuthTab("login");
                  setAuthError("");
                }}
                className={`py-4 font-bold text-sm transition ${
                  authTab === "login" ? "text-green-600 border-b-2 border-green-600 bg-slate-50/50" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthTab("signup");
                  setAuthError("");
                }}
                className={`py-4 font-bold text-sm transition ${
                  authTab === "signup" ? "text-green-600 border-b-2 border-green-600 bg-slate-50/50" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Register
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAuthSubmit} className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-800">
                {authTab === "login" ? "Welcome Back!" : "Create Quiz Account"}
              </h3>
              
              {authError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded">
                  {authError}
                </div>
              )}

              {authTab === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  {authTab === "login" ? "Username or Email" : "Username"}
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={authTab === "login" ? "username or email" : "choose_username"}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {authTab === "signup" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  {loading ? "Please wait..." : authTab === "login" ? "Sign In" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
