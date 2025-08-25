import { useState } from "react";
import Dashboard from "../Dashboard";
import SideBar from "../../components/Admin/SideBar.jsx";
import DepartmentManager from "./DepartmentManager.jsx";
import EmployeeManager from "./EmployeeManager.jsx";
import AttendanceManager from "./AttendanceManager.jsx";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;

      case "employees":
        return (
          <>
          <EmployeeManager/>
          </>
        );

      case "departments":
        return (
          <>
          <DepartmentManager/>
          </>
        );

      case "attendance":
        return (
          <div>
           <AttendanceManager/>
          </div>
        );

      case "leave-requests":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Leave Requests</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p>Leave request management </p>
            </div>
          </div>
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
