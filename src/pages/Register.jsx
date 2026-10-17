import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";


function Register() {
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(event) {
  event.preventDefault();
  setError("");

  try {
    await register({
      name,
      emailId,
      password,
    });

    navigate("/dashboard");
  } catch (error) {
    setError(error.message);
  }
 }

 return (
 <div>
 <h1>registration form</h1>

 <form onSubmit={handleSubmit}>
  {error && <p>{error}</p>}

  <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(event) => setName(event.target.value)}
  />

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

  <button type="submit">Register</button>
 </form>
 </div>
 );

}

export default Register;