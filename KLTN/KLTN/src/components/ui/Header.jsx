import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Background from "D:/KLTN-Website/KLTN/KLTN/src/images/login_background.jpg";

const Header = () => {
  const navigate = useNavigate(); // Hook để điều hướng trang

  const handleLogout = () => {
    // Hiển thị hộp thoại xác nhận đăng xuất
    const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất không?");

    if (confirmLogout) {
      // Xóa thông tin đăng nhập (ví dụ: token hoặc thông tin người dùng)
      localStorage.removeItem("user"); // Hoặc sessionStorage.removeItem("user")

      // Chuyển hướng về trang đăng nhập
      navigate("/");
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-16 bg-gray-500 flex items-center justify-between px-5 text-white z-50 bg-cover bg-center"
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

        <button
          onClick={handleLogout} // Gọi hàm handleLogout khi bấm vào nút đăng xuất
          className="flex items-center space-x-2 hover:text-red-400 transition"
        >
          <FaSignOutAlt className="text-2xl" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
