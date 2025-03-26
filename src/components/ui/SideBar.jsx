import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaCog,
  FaHome,
} from "react-icons/fa";
import Logo from "D:/KLTN/src/images/login_background.jpg"; // Cập nhật đường dẫn logo

const Sidebar = () => {
  return (
    <div className="pt-10 mt-12 fixed top-0 left-0 w-64 h-full bg-gray-400 shadow-md p-4">
      {/* Logo & Tên hệ thống */}
      <div className="flex justify-center mb-4">
        <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full" />
      </div>
      <h2 className="text-center text-xl font-semibold text-blue-600">
        Hệ thống NCKH
      </h2>

      {/* Menu Items */}
      <nav className="mt-6 space-y-3">
        <MenuItem icon={<FaHome />} text="Dashboard" active />
        <MenuItem icon={<FaUserGraduate />} text="Sinh viên" />
        <MenuItem icon={<FaChalkboardTeacher />} text="Giảng viên" />
        <MenuItem icon={<FaBook />} text="Đề tài" />
        <MenuItem icon={<FaCog />} text="Cài đặt" />
      </nav>
    </div>
  );
};

const MenuItem = ({ icon, text, active }) => (
  <div
    className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer transition 
      ${
        active
          ? "bg-blue-100 text-blue-600 border border-blue-400"
          : "hover:bg-gray-200"
      }
    `}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default Sidebar;
