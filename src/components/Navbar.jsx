import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";


function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

 async function handleLogout() {
  try {
    await logout();
    navigate("/login");
  } catch (error) {
    console.error(error);
  }
 }
  return (
    <nav className="navbar">
      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
