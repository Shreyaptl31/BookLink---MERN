import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      localStorage.setItem("token", data.session.access_token);
      navigate("/dashboard");
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
            Your bookmarks,
            <br />
            <em>beautifully</em> organised.
          </h1>
          <p className="auth-subhead">
            Save any link in one click. Filter by public or private. Share your
            collection with the world via your personal handle.
          </p>
          <div className="auth-proof">
            <div className="auth-proof-dots">
              <div className="auth-proof-dot">P</div>
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
          <div className="auth-form-eyebrow">Welcome back</div>
          <h2 className="auth-form-title">Sign in to BookLink</h2>
          <p className="auth-form-sub">
            Good to see you again — your bookmarks are waiting.
          </p>

          {error && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle-fill" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <i className="bi bi-lock auth-input-icon" />
              </div>
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ width: "0.9rem", height: "0.9rem" }}
                  />
                  Signing in…
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            New to BookLink? <Link to="/register">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
