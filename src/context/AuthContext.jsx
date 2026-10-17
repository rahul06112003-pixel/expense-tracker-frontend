import { createContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 async function login(credentials) {
  await loginUser(credentials);

  const data = await getCurrentUser();

  setUser(data.user);
 }

 async function logout() {
  await logoutUser();
  setUser(null);
 }

 async function register(credentials) {
  await registerUser(credentials);

  const data = await getCurrentUser();

  setUser(data.user);
 }

  useEffect(() => {
    async function checkAuthentication() {
     try {
      const data = await getCurrentUser();
      setUser(data.user);
     } catch (error) {
      if (error.status === 401) {
        setUser(null);
      } else {
       console.error("Unable to verify authentication:", error.message);
      }
      } finally {
       setLoading(false);
      }
    }

    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;