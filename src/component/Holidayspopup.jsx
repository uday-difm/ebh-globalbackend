"use client";
import { useEffect, useState } from "react";

export default function Popup() {
  const [show, setShow] = useState(false);
   const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


s

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to subscribe");
      } else {
        setMessage("🎉 Subscribed successfully!");
        setEmail("");
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  if (!show) return null;

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div
        className="relative w-full max-w-lg min-h-[400px] rounded-xl p-8 bg-cover bg-center flex flex-col justify-center"
        style={{
          backgroundImage: "url('https://earthbyhumans.s3-eu-central-2.ionoscloud.com/Popup_Earth By Humans.jpg')",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 text-gray-2xl text-xl"
        >
          ✕
        </button>

        <h2 className="pt-10 text-center text-2xl font-bold text-green-500">
          Subscribe Now
        </h2>

        {/* Input + Button (Same Row) */}
        <div className="flex gap-2 mt-6">
          <input
            type="email"
             value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 rounded-lg px-4 py-2 outline-none border border-green-300"
          />
           <button
            onClick={handleSubscribe}
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
           {/* Message */}
        {message && (
          <p className="mt-4 text-center text-green font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
