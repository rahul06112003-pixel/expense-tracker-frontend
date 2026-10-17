import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import MainLayout from "./Layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Income from "./pages/Income";
import Ipo from "./pages/Ipo";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/ipo" element={<Ipo />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;