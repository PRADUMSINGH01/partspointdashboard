"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Force Tailwind 'dark' class on <html> while mounted (restores previous on unmount).
  useEffect(() => {
    const doc = document.documentElement;
    const hadDark = doc.classList.contains("dark");
    doc.classList.add("dark"); // Tailwind dark-mode = class strategy
    doc.classList.add("forced-dark-mode"); // optional marker
    return () => {
      // only remove if we added it (don't remove if it existed before)
      if (!hadDark) doc.classList.remove("dark");
      doc.classList.remove("forced-dark-mode");
    };
  }, []);

  // restore remembered email (if any)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("login_email_v1");
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const validate = () => {
    setError("");
    if (!email) return "Please enter your email.";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://partspointdashboard.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          payload?.message || "Sign in failed. Please check your credentials.";
        setError(message);
        return;
      }

      setSuccess(payload?.message || "Signed in successfully.");

      if (payload?.token) {
        try {
          localStorage.setItem("auth_token_v1", payload.token);
        } catch (err) {}
      }

      try {
        if (remember) {
          localStorage.setItem("login_email_v1", email);
        } else {
          localStorage.removeItem("login_email_v1");
        }
      } catch (err) {}

      if (payload?.redirect) {
        window.location.href = payload.redirect;
      } else {
        setTimeout(() => window.location.reload(), 600);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      aria-live="polite"
      // use !important helpers to strongly override any outer white backgrounds
      className="min-h-screen flex items-center justify-center p-8
                 !bg-gradient-to-br !from-slate-900 !via-slate-950 !to-slate-900
                 text-slate-100"
    >
      <section
        aria-labelledby="login-title"
        className="w-full max-w-md rounded-2xl p-7
                   bg-gradient-to-b from-white/2 to-white/5/10 dark:from-slate-800/60 dark:to-slate-900/60
                   border border-white/5 dark:border-white/5 shadow-2xl backdrop-blur-md"
      >
        <div className="text-center mb-4">
          <svg
            className="w-12 h-12 mx-auto text-cyan-400"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M12 2L2 7v6c0 5 5 9 10 9s10-4 10-9V7l-10-5z" />
          </svg>
          <h1 id="login-title" className="text-lg font-semibold text-slate-100">
            Welcome back
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-lg px-3 py-2 text-sm bg-red-900/40 border border-red-700/30 text-red-300"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg px-3 py-2 text-sm bg-emerald-900/35 border border-emerald-700/30 text-emerald-200"
            >
              {success}
            </div>
          )}

          <label className="block">
            <span className="text-sm text-slate-400 block mb-2">Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className="w-full px-3 py-3 rounded-md bg-[#071024] border border-white/6 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={!!error && error.toLowerCase().includes("email")}
              aria-describedby="email-help"
            />
            <small
              id="email-help"
              className="text-xs text-slate-500 mt-1 block"
            >
              We'll never share your email.
            </small>
          </label>

          <label className="block">
            <span className="text-sm text-slate-400 block mb-2">Password</span>
            <div className="flex gap-2 items-center">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="flex-1 px-3 py-3 rounded-md bg-[#071024] border border-white/6 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-invalid={
                  !!error && error.toLowerCase().includes("password")
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="px-3 py-2 rounded-md bg-white/3 text-slate-200 font-semibold hover:bg-white/6 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-slate-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-white/6 bg-[#071024] accent-cyan-400"
              />
              Remember me
            </label>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-slate-400 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-semibold
                       bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : null}
            <span>{loading ? "Signing in…" : "Sign in"}</span>
          </button>

          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
            <span className="flex-1 h-px bg-white/5" />
            <span className="whitespace-nowrap">or continue with</span>
            <span className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-3" aria-hidden="true">
            <button
              type="button"
              onClick={() => alert("Not implemented")}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-white/6 bg-white/3 text-slate-200"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.877v-6.99H7.898v-2.887h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.887h-2.33v6.99C18.343 21.128 22 17 22 12z" />
              </svg>
              <span>Facebook</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Not implemented")}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-white/6 bg-white/3 text-slate-200"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M20 6.5A6.5 6.5 0 0 1 13.5 13c0 .5.05 1 .15 1.5-3.4.05-6.43-1.84-8.45-4.4-.36.62-.56 1.34-.56 2.11 0 1.46.74 2.75 1.86 3.51-.69 0-1.34-.21-1.91-.52v.05c0 2.03 1.44 3.73 3.35 4.12-.35.09-.72.14-1.1.14-.27 0-.53-.03-.78-.07.53 1.66 2.06 2.87 3.88 2.91A9.23 9.23 0 0 1 4 20.5 13 13 0 0 0 10.83 22c8.36 0 12.93-6.93 12.93-12.93 0-.2 0-.4-.02-.6A9.2 9.2 0 0 0 22 6.5z" />
              </svg>
              <span>Twitter</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
