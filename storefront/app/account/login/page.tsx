"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginCustomer, saveToken } from "@/lib/customer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError(null);
    setLoading(true);
    try {
      const result = await loginCustomer(email, password);
      if ("error" in result) { setError(result.error); return; }
      saveToken(result.token);
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <Link href="/">
            <div className="auth-logo__text">
              <span className="auth-logo__brand">SANDSTORM</span>
              <span className="auth-logo__sub">KENYA</span>
            </div>
          </Link>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to view orders and manage your profile.</p>

        {error && (
          <div className="auth-error" role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-filled btn-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "SIGNING IN…" : "SIGN IN"}
          </button>
        </form>

        <hr className="auth-divider" />

        <p className="auth-switch">
          New to Sandstorm Kenya?{" "}
          <Link href="/account/register">Create an account →</Link>
        </p>
      </div>
    </div>
  );
}
