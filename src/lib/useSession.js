"use client";

import { useState, useEffect } from "react";

export function useSession() {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok && active) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setSession(data);
            setStatus("authenticated");
          } else {
            setSession(null);
            setStatus("unauthenticated");
          }
        } else if (active) {
          setSession(null);
          setStatus("unauthenticated");
        }
      } catch (err) {
        if (active) {
          setSession(null);
          setStatus("unauthenticated");
        }
      }
    }
    fetchSession();
    return () => {
      active = false;
    };
  }, []);

  return { data: session, status };
}
