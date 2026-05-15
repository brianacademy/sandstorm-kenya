"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerCustomer, createCustomerProfile, loginCustomer, saveToken } from "@/lib/customer";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [phone,     setPhone]     = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // Step 1: Register auth identity
      const reg = await registerCustomer(email, password);
      if ("error" in reg) { setError(reg.error); return; }

      // Step 2: Create customer profile with the registration token
      await createCustomerProfile(reg.token, {
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });

      // Step 3: Log in to get a fresh token, save & redirect
      const login = await loginCustomer(email, password);
      if ("error" in login) {
        // Registration succeeded — redirect to login
        router.push("/account/login?registered=1");
        return;
      }
      saveToken(login.token);
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

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join to track orders, save favourites, and checkout faster.</p>

        {error && (
          <div className="auth-error" role="alert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            </svg>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-first">First Name *</label>
              <input id="reg-first" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" required />
            </div>
            <div className="form-group">
              <label htmlFor="reg-last">Last Name *</label>
              <input id="reg-last" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Wanjiku" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address *</label>
            <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" autoComplete="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone">Phone (optional)</label>
            <input id="reg-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password *</label>
            <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" autoComplete="new-password" required />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password *</label>
            <input id="reg-confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" autoComplete="new-password" required />
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-filled btn-full"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
          </button>
        </form>

        <hr className="auth-divider" />

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/account/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
