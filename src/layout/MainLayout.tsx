// src/Layout/MainLayout.jsx
import React, { useState } from "react";
import Sidebar from "../Component/Sidebar/Sidebar";
import Header from "../Component/Header/Header";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="dashboard-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
