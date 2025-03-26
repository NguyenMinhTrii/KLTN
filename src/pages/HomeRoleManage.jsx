import { useState } from "react";
import Sidebar from "D:/KLTN/src/components/ui/SideBar.jsx";
import Dashboard from "D:/KLTN/src/components/ui/Dashboard.jsx";
import Header from "D:/KLTN/src/components/ui/Header.jsx";

const Home = () => {
  const [selected, setSelected] = useState("dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định trên cùng */}
      <Header className="fixed top-0 left-0 w-full z-10 bg-white shadow-md" />

      <div className="flex">
        {/* Sidebar cố định bên trái */}
        <Sidebar
          setSelected={setSelected}
          className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-800 shadow-lg"
        />

        {/* Phần nội dung chính */}
        <div className="flex-1 p-16 w-[calc(100vw-256px)] max-w-[1280px] mx-auto mt-16 h-auto min-h-[calc(100vh-4rem)] ">
          <h1 className="text-3xl font-bold mb-6">
            {selected === "dashboard" && "Dashboard Tổng Quan"}
            {selected === "students" && "Quản lý Sinh viên"}
            {selected === "lecturers" && "Quản lý Giảng viên"}
            {selected === "projects" && "Quản lý Đề tài"}
            {selected === "settings" && "Cài đặt"}
          </h1>
          {/* Nội dung của từng trang */}
          {selected === "dashboard" && <Dashboard />}
          {selected === "students" && <div>Trang Quản lý Sinh viên</div>}
          {selected === "lecturers" && <div>Trang Quản lý Giảng viên</div>}
          {selected === "projects" && <div>Trang Quản lý Đề tài</div>}
          {selected === "settings" && <div>Trang Cài đặt</div>}
        </div>
      </div>
    </div>
  );
};

export default Home;
