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

    useEffect(() => {
        // restore remembered email (if any)
        try {
            const saved = localStorage.getItem("login_email_v1");
            if (saved) {
                setEmail(saved);
                setRemember(true);
            }
        } catch (e) {
            // ignore storage errors
        }
    }, []);

    const validate = () => {
        setError("");
        if (!email) return "Please enter your email.";
        // simple but practical email check
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
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const payload = await res.json().catch(() => ({}));

        if (!res.ok) {
            const message = payload?.message || "Sign in failed. Please check your credentials.";
            setError(message);
            return;
        }

        // Successful login
        setSuccess(payload?.message || "Signed in successfully.");
        

        // Store token if backend returned one
        if (payload?.token) {
            try {
                localStorage.setItem("auth_token_v1", payload.token);
            } catch (err) {
                // ignore storage errors
            }
        }

        // Remember email preference
        try {
            if (remember) {
                localStorage.setItem("login_email_v1", email);
            } else {
                localStorage.removeItem("login_email_v1");
            }
        } catch (err) {
            // ignore storage errors
        }

        // Redirect if backend provided URL, otherwise reload to update app state
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
        <main className="wrap text-black">
            <section className="card" aria-labelledby="login-title">
                <div className="brand">
                    <svg className="logo" viewBox="0 0 24 24" aria-hidden="true">
                        <defs />
                        <path d="M12 2L2 7v6c0 5 5 9 10 9s10-4 10-9V7l-10-5z" fill="currentColor" />
                    </svg>
                    <h1 id="login-title">Welcome back</h1>
                    <p className="subtitle">Sign in to continue to your dashboard</p>
                </div>

                <form onSubmit={onSubmit} className="form" noValidate>
                    {error && (
                        <div role="alert" className="toast error">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div role="status" className="toast success">
                            {success}
                        </div>
                    )}

                    <label className="field">
                        <span className="label-text">Email</span>
                        <input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            aria-invalid={!!error && error.toLowerCase().includes("email")}
                            aria-describedby="email-help"
                        />
                        <small id="email-help" className="hint">
                            We'll never share your email.
                        </small>
                    </label>

                    <label className="field">
                        <span className="label-text">Password</span>
                        <div className="password-row">
                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                aria-invalid={!!error && error.toLowerCase().includes("password")}
                            />
                            <button
                                type="button"
                                className="eye"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-pressed={showPassword}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </label>

                    <div className="row">
                        <label className="remember">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Remember me
                        </label>

                        <a href="#" onClick={(e) => e.preventDefault()} className="forgot">
                            Forgot password?
                        </a>
                    </div>

                    <button className="submit" type="submit" disabled={loading}>
                        {loading ? (
                            <span className="spinner" aria-hidden="true" />
                        ) : null}
                        <span className="btn-text">{loading ? "Signing in…" : "Sign in"}</span>
                    </button>

                    <div className="divider" aria-hidden="true">
                        <span>or continue with</span>
                    </div>

                    <div className="socials" aria-hidden="true">
                        <button type="button" className="social" onClick={() => alert("Not implemented")}>
                            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.877v-6.99H7.898v-2.887h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.887h-2.33v6.99C18.343 21.128 22 17 22 12z" /></svg>
                            <span>Facebook</span>
                        </button>

                        <button type="button" className="social" onClick={() => alert("Not implemented")}>
                            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true"><path d="M20 6.5A6.5 6.5 0 0 1 13.5 13c0 .5.05 1 .15 1.5-3.4.05-6.43-1.84-8.45-4.4-.36.62-.56 1.34-.56 2.11 0 1.46.74 2.75 1.86 3.51-.69 0-1.34-.21-1.91-.52v.05c0 2.03 1.44 3.73 3.35 4.12-.35.09-.72.14-1.1.14-.27 0-.53-.03-.78-.07.53 1.66 2.06 2.87 3.88 2.91A9.23 9.23 0 0 1 4 20.5 13 13 0 0 0 10.83 22c8.36 0 12.93-6.93 12.93-12.93 0-.2 0-.4-.02-.6A9.2 9.2 0 0 0 22 6.5z" /></svg>
                            <span>Twitter</span>
                        </button>
                    </div>
                </form>
            </section>

            <style jsx>{`
                :root {
                    --bg: linear-gradient(135deg, #0f172a 0%, #0b1220 60%);
                    --card: #0b1220;
                    --muted: #94a3b8;
                    --accent: #06b6d4;
                    --glass: rgba(255,255,255,0.02);
                    --error: #ef4444;
                    --success: #10b981;
                }
                * { box-sizing: border-box; }
                .wrap {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px;
                    background: var(--bg);
                    color: #e6eef8;
                    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
                }
                .card {
                    width: 100%;
                    max-width: 420px;
                    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
                    border: 1px solid rgba(255,255,255,0.04);
                    border-radius: 12px;
                    padding: 28px;
                    box-shadow: 0 6px 30px rgba(2,6,23,0.6);
                    backdrop-filter: blur(6px);
                }
                .brand {
                    text-align: center;
                    margin-bottom: 18px;
                }
                .logo {
                    width: 48px;
                    height: 48px;
                    color: var(--accent);
                    margin: 0 auto 10px;
                }
                h1 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                }
                .subtitle {
                    margin: 6px 0 0;
                    font-size: 13px;
                    color: var(--muted);
                }
                .form {
                    margin-top: 14px;
                }
                .toast {
                    padding: 10px 12px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    font-size: 13px;
                }
                .toast.error {
                    background: linear-gradient(90deg, rgba(239,68,68,0.08), rgba(239,68,68,0.04));
                    border: 1px solid rgba(239,68,68,0.15);
                    color: var(--error);
                }
                .toast.success {
                    background: linear-gradient(90deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02));
                    border: 1px solid rgba(16,185,129,0.12);
                    color: var(--success);
                }

                .field {
                    display: block;
                    margin-bottom: 12px;
                }
                .label-text {
                    display: block;
                    font-size: 13px;
                    margin-bottom: 6px;
                    color: var(--muted);
                }
                .input {
                    width: 100%;
                    padding: 12px 12px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.04);
                    background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
                    color: #e6eef8;
                    outline: none;
                    font-size: 14px;
                }
                .input:focus {
                    box-shadow: 0 0 0 4px rgba(6,182,212,0.06);
                    border-color: rgba(6,182,212,0.6);
                }
                .hint {
                    display: block;
                    margin-top: 6px;
                    font-size: 12px;
                    color: var(--muted);
                }

                .password-row {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                .eye {
                    appearance: none;
                    border: none;
                    background: var(--glass);
                    color: var(--muted);
                    padding: 8px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 13px;
                }
                .eye:focus { outline: 2px solid rgba(6,182,212,0.12); }

                .row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 6px 0 16px;
                }
                .remember {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    color: var(--muted);
                    font-size: 13px;
                }
                .remember input { width: 16px; height: 16px; }

                .forgot {
                    color: var(--muted);
                    font-size: 13px;
                    text-decoration: none;
                }
                .forgot:hover { text-decoration: underline; }

                .submit {
                    width: 100%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 12px 16px;
                    border-radius: 10px;
                    border: none;
                    background: linear-gradient(90deg, #06b6d4, #0ea5b5);
                    color: #06243a;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 15px;
                    box-shadow: 0 6px 18px rgba(6,182,212,0.12);
                }
                .submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    box-shadow: none;
                }
                .spinner {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: rgba(255,255,255,0.9);
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 16px 0;
                    color: var(--muted);
                    font-size: 13px;
                }
                .divider::before, .divider::after {
                    content: "";
                    height: 1px;
                    background: rgba(255,255,255,0.03);
                    flex: 1;
                }

                .socials {
                    display: flex;
                    gap: 10px;
                }
                .social {
                    flex: 1;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.04);
                    background: rgba(255,255,255,0.01);
                    color: var(--muted);
                    cursor: pointer;
                    font-size: 14px;
                }
                .social .icon { width: 16px; height: 16px; color: var(--muted); }
                .social:active { transform: translateY(1px); }

                @media (max-width: 520px) {
                    .card { padding: 20px; border-radius: 10px; }
                }
            `}</style>
        </main>
    );
}