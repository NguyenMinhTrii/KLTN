import { useState } from "react";
import Sidebar from "D:/KLTN-Website/KLTN/KLTN/src/components/ui/SideBar.jsx";
import Dashboard from "D:/KLTN-Website/KLTN/KLTN/src/components/ui/Dashboard.jsx";
import Header from "D:/KLTN-Website/KLTN/KLTN/src/components/ui/Header.jsx";
import Students from "D:/KLTN-Website/KLTN/KLTN/src/components/ui/Students.jsx";
import LecturerList from "D:/KLTN-Website/KLTN/KLTN/src/components/ui/Lecturer.jsx";

const Home = () => {
  const [selected, setSelected] = useState("dashboard");

  return (
    <div className="min-h-screen">
      {/* Header cố định */}
      <Header />

      <div className="flex pt-16">
        {/* Sidebar bên trái */}
        <Sidebar
          setSelected={setSelected}
          // className="w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-800 shadow-lg"
        />

        {/* Nội dung chính */}
        <div className="ml-64 w-[calc(100vw-256px)] p-8 overflow-y-auto pt-16 fixed left-54 top-16 right-0 bottom-0">
          <h1 className="text-3xl font-bold mb-6">
            {selected === "dashboard" && "Dashboard Tổng Quan"}
            {selected === "students" && "Quản lý Sinh viên"}
            {selected === "lecturers" && "Quản lý Giảng viên"}
            {selected === "projects" && "Quản lý Đề tài"}
            {selected === "settings" && "Cài đặt"}
          </h1>

          {/* Nội dung component động */}
          {selected === "dashboard" && <Dashboard />}
          {selected === "students" && <Students></Students>}
          {selected === "lecturers" && <LecturerList></LecturerList>}
          {selected === "projects" && <div>Trang Quản lý Đề tài</div>}
          {selected === "settings" && <div>Trang Cài đặt</div>}
        </div>
      </div>
    </div>
  );
};

export default Home;
