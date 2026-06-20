import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    handle: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      setSuccess("Account created! Check your email to verify, then sign in.");
      setTimeout(() => navigate("/"), 2500);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* ── Left hero panel ── */}
      <div className="auth-hero">
        <div className="auth-hero-inner">
          <div className="auth-logo">
            Book<span>Link</span>
          </div>

          <h1 className="auth-headline">
            Claim your
            <br />
            <em>personal</em> web.
          </h1>
          <p className="auth-subhead">
            Pick a handle, start saving links, and share your public collection
            at <strong style={{ color: "#E2E8F0" }}>booklink.app/@you</strong> —
            in under a minute.
          </p>

          <div className="auth-proof">
            <div className="auth-proof-dots">
              <div className="auth-proof-dot">A</div>
              <div className="auth-proof-dot">S</div>
              <div className="auth-proof-dot">K</div>
              <div className="auth-proof-dot">M</div>
            </div>
            <span className="auth-proof-text">
              Join <strong>2,400+</strong> developers already saving smarter
            </span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-panel">
        <div className="auth-form-box">
          <div className="auth-form-eyebrow">Get started free</div>
          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-sub">
            No credit card. No noise. Just your links, organised.
          </p>

          {error && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle-fill" />
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <i className="bi bi-check-circle-fill" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-group">
              <label htmlFor="handle">Your handle</label>
              <div className="auth-input-wrap">
                <input
                  id="handle"
                  type="text"
                  name="handle"
                  placeholder="yourhandle"
                  value={formData.handle}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="has-prefix"
                  style={{ paddingLeft: "3.2rem" }}
                />
                <i className="bi bi-at auth-input-icon" />
              </div>
              <p className="auth-hint">
                Your public page will be at{" "}
                <strong>booklink.app/@{formData.handle || "yourhandle"}</strong>
              </p>
            </div>

            <div className="auth-group">
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                <i className="bi bi-envelope auth-input-icon" />
              </div>
            </div>

            <div className="auth-group">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <i className="bi bi-lock auth-input-icon" />
              </div>
            </div>

            <button
              className="auth-btn"
              type="submit"
              disabled={loading || !!success}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ width: "0.9rem", height: "0.9rem" }}
                  />
                  Creating account…
                </>
              ) : (
                <>
                  <i className="bi bi-rocket-takeoff" />
                  Create account
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/">Sign in</Link>
          </p>

          <p className="auth-terms">
            By creating an account you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
