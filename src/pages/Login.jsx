import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const credentials = {
      emailId,
      password,
    };

    try {
      await login(credentials);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={emailId}
          onChange={(event) => setEmailId(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;