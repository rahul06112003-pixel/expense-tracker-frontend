
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Auth.css";

function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const credentials = {
      emailId,
      password,
    };

    try {
      await login(credentials);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Link to="/" className="auth-brand">
        Expense Tracker
      </Link>

      <section className="auth-card">
        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to manage your finances.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <div className="auth-field">
            <label htmlFor="emailId">Email address</label>
            <input
              id="emailId"
              type="email"
              placeholder="you@example.com"
              value={emailId}
              onChange={(event) => setEmailId(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
