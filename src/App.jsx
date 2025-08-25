import { Route, Routes } from "react-router-dom";
import "./App.css";
// import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-dashboard" element={
        <ProtectedRoutes allowedRoutes={["admin"]}>
        <AdminDashboard/>
        </ProtectedRoutes>
        } />
        <Route path="/employee-dashboard" element={
      <ProtectedRoutes allowedRoutes={["employee"]}>
      <EmployeeDashboard/>
      </ProtectedRoutes>
      } />
    </Routes>
    
  );
}

export default App;
