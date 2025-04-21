import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomeRoleManage"; // Trang chủ sau khi đăng nhập
import LoginPage from "./pages/Login"; // Trang đăng nhập

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />{" "}
        {/* Route cho trang đăng nhập */}
        <Route path="/dashboard" element={<Home />} />{" "}
        {/* Route cho trang chủ */}
      </Routes>
    </Router>
  );
}

export default App;
