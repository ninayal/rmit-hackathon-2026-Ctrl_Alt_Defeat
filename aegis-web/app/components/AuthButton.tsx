
"use client";

import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        setAuthenticated(Boolean(session?.user));
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <span>CHECKING SESSION...</span>;
  }

  return (
    <button
      onClick={() =>
        authenticated
          ? signOut({ callbackUrl: "/" })
          : signIn("tidecloak", { callbackUrl: "/" })
      }
      style={{
        background: authenticated ? "transparent" : "#e5e5e5",
        color: authenticated ? "#e5e5e5" : "#111",
        border: "1px solid #666",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 600,
        letterSpacing: "0.08em",
        fontSize: "12px",
      }}
    >
      {authenticated ? "SIGN OUT" : "SIGN IN"}
    </button>
  );
}
