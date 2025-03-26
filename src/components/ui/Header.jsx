import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Background from "D:/KLTN/src/images/login_background.jpg";
const Header = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-14 bg-gray-500 flex items-center justify-between px-5 text-white z-50 bg-cover bg-center "
      style={{
        backgroundImage: `url(${Background})`,
      }}
    >
      {/* Tiêu đề hệ thống */}
      <h1 className="text-2xl font-bold ">Hệ thống Quản lý NCKH</h1>

      {/* Menu tài khoản bên phải */}
      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 hover:text-gray-300 transition">
          <FaUserCircle className="text-2xl" />
          <span>Tài khoản</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-red-400 transition">
          <FaSignOutAlt className="text-2xl" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
