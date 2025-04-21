import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Admin from "./models/Admin.js";
import Student from "./models/Students.js";
import Lecturer from "./models/Lecturers.js";

const app = express();

// Cấu hình CORS đã được cập nhật để cho phép DELETE và PUT
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE", // Thêm PUT và DELETE vào danh sách phương thức được phép
    allowedHeaders: "Content-Type",
  })
);
// app.use(cors()); // Cho phép tất cả các origin và phương thức (chỉ để kiểm tra)
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/KLTN")
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Route xử lý đăng nhập
app.post("/api/login-admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin không tồn tại." });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "Mật khẩu không đúng." });
    }

    res.status(200).json({
      message: "Đăng nhập thành công!",
      redirectTo: "/dashboard", // trang chính
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập admin." });
  }
});

// API lấy danh sách sinh viên
// API lấy danh sách sinh viên
app.get("/api/students", async (req, res) => {
  const { department, major, search } = req.query;
  let filter = {};

  if (department) filter.department = department;
  if (major) filter.major = major;
  if (search) {
    filter.$or = [
      { full_name: { $regex: search, $options: "i" } },
      { student_id: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const students = await Student.find(filter);
    res.json(students); // Trả về trực tiếp, không format birthday
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi truy xuất sinh viên" });
  }
});

// Thêm sinh viên mới
app.post("/api/students", async (req, res) => {
  const {
    student_id,
    full_name,
    email,
    phone,
    birthday,
    department,
    major,
    // password, // Không cần lấy password từ body nữa
  } = req.body;
  const plainPassword = generatePasswordFromBirthday(birthday);

  // Validate định dạng phía backend (giữ nguyên)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const nameRegex = /^[\p{L}\s]+$/u;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ!" });
  }

  if (!phoneRegex.test(phone)) {
    return res
      .status(400)
      .json({ message: "Số điện thoại phải gồm 10 chữ số!" });
  }

  if (!nameRegex.test(full_name)) {
    return res.status(400).json({ message: "Họ tên không hợp lệ!" });
  }

  let birthDate;
  if (birthday) {
    const [day, month, year] = birthday.split("/");
    birthDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`); // Chuyển đổi thủ công sang Date
  }

  try {
    // **KIỂM TRA EMAIL TRÙNG LẶP**
    const existingStudentWithEmail = await Student.findOne({ email });
    if (existingStudentWithEmail) {
      return res
        .status(400)
        .json({ message: "Địa chỉ email này đã được sử dụng!" });
    }

    const existingStudent = await Student.findOne({ student_id });
    if (existingStudent) {
      return res.status(400).json({ message: "Mã số sinh viên đã tồn tại!" });
    }

    const newStudent = new Student({
      student_id,
      full_name,
      email,
      phone,
      birthday: birthDate, // Sử dụng birthDate đã chuyển đổi
      department,
      major,
      password: plainPassword,
    });

    await newStudent.save();
    res.status(201).json({ message: "Thêm sinh viên thành công!" });
  } catch (err) {
    console.error("Lỗi khi thêm sinh viên:", err);
    res.status(500).json({ message: "Lỗi server khi thêm sinh viên." });
  }
});

// API xóa sinh viên theo ID
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }

    res.status(200).json({ message: "Xóa sinh viên thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa sinh viên:", err);
    res.status(500).json({ message: "Lỗi server khi xóa sinh viên" });
  }
});

// API cập nhật thông tin sinh viên
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      student_id,
      full_name,
      email,
      phone,
      birthday,
      department,
      major,
      password,
    } = req.body;

    // Validate định dạng phía backend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[\p{L}\s]+$/u; // họ tên tiếng Việt

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Số điện thoại phải gồm 10 chữ số!" });
    }

    if (!nameRegex.test(full_name)) {
      return res.status(400).json({ message: "Họ tên không hợp lệ!" });
    }

    // Kiểm tra mã số sinh viên bị trùng (nếu có thay đổi mã số)
    const existingStudent = await Student.findOne({
      student_id,
      _id: { $ne: id }, // Không tính chính bản thân sinh viên đang được cập nhật
    });

    if (existingStudent) {
      return res.status(400).json({ message: "Mã số sinh viên đã tồn tại!" });
    }

    let birthDate;
    if (birthday) {
      const [day, month, year] = birthday.split("/");
      birthDate = new Date(`${year}-${month}-${day}`);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        student_id,
        full_name,
        email,
        phone,
        birthday: birthDate,
        department,
        major,
        password,
      },
      { new: true } // Trả về dữ liệu đã cập nhật
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }

    res.status(200).json({
      message: "Cập nhật sinh viên thành công",
      student: updatedStudent,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật sinh viên:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật sinh viên" });
  }
});

// API lấy thông tin của một sinh viên theo ID
// API lấy thông tin của một sinh viên theo ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }

    res.status(200).json(student); // Trả về trực tiếp, không format birthday
  } catch (err) {
    console.error("Lỗi khi truy xuất thông tin sinh viên:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi truy xuất thông tin sinh viên" });
  }
});

// Hàm định dạng ngày tháng
const formatDate = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// server.js hoặc routes/lecturers.js
// Ví dụ (Node.js với Mongoose):
app.get("/api/lecturers", async (req, res) => {
  try {
    const { department, search } = req.query;
    const query = {};
    if (department) {
      query.department = department;
    }
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { lecturer_id: { $regex: search, $options: "i" } },
      ];
    }
    const lecturers = await Lecturer.find(query);
    res.json(lecturers); // Trả về trực tiếp, không format birthday
  } catch (error) {
    console.error("Lỗi khi tải giảng viên:", error);
    res.status(500).json({ message: "Lỗi khi tải dữ liệu giảng viên" });
  }
});

// API lấy danh sách các khoa của giảng viên (cho bộ lọc)
app.get("/api/lecturers/departments", async (req, res) => {
  try {
    const departments = await Lecturer.distinct("department");
    res.json(departments);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khoa:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách khoa" });
  }
});

// Thêm giảng viên mới
// Thêm giảng viên mới
// Thêm giảng viên mới
app.post("/api/lecturers", async (req, res) => {
  const {
    lecturer_id,
    full_name,
    email,
    phone,
    birthday,
    department,
    password,
  } = req.body;
  const plainPassword = generatePasswordFromBirthday(birthday);
  // Validate định dạng phía backend (tương tự sinh viên)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const nameRegex = /^[\p{L}\s]+$/u; // họ tên tiếng Việt

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email không hợp lệ!" });
  }

  if (phone && !phoneRegex.test(phone)) {
    return res
      .status(400)
      .json({ message: "Số điện thoại phải gồm 10 chữ số!" });
  }

  if (!nameRegex.test(full_name)) {
    return res.status(400).json({ message: "Họ tên không hợp lệ!" });
  }

  let birthDate;
  if (birthday) {
    const [day, month, year] = birthday.split("/");
    birthDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`); // Chuyển đổi thủ công sang Date
  }

  try {
    // **KIỂM TRA EMAIL TRÙNG LẶP**
    const existingLecturerWithEmail = await Lecturer.findOne({ email });
    if (existingLecturerWithEmail) {
      return res
        .status(400)
        .json({ message: "Địa chỉ email này đã được sử dụng!" });
    }

    const existingLecturer = await Lecturer.findOne({ lecturer_id });
    if (existingLecturer) {
      return res.status(400).json({ message: "Mã số giảng viên đã tồn tại!" });
    }

    const newLecturer = new Lecturer({
      lecturer_id,
      full_name,
      email,
      phone,
      birthday: birthDate, // Sử dụng birthDate đã chuyển đổi
      department,
      password: plainPassword,
    });

    await newLecturer.save();
    res.status(201).json({ message: "Thêm giảng viên thành công!" });
  } catch (err) {
    console.error("Lỗi khi thêm giảng viên:", err);
    res.status(500).json({ message: "Lỗi server khi thêm giảng viên." });
  }
});

// API xóa giảng viên theo ID
app.delete("/api/lecturers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLecturer = await Lecturer.findByIdAndDelete(id);

    if (!deletedLecturer) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });
    }

    res.status(200).json({ message: "Xóa giảng viên thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa giảng viên:", err);
    res.status(500).json({ message: "Lỗi server khi xóa giảng viên" });
  }
});

// API cập nhật thông tin giảng viên
app.put("/api/lecturers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lecturer_id,
      full_name,
      email,
      phone,
      birthday,
      department,
      password,
    } = req.body;

    // Validate định dạng phía backend (tương tự sinh viên)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[\p{L}\s]+$/u; // họ tên tiếng Việt

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    if (phone && !phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Số điện thoại phải gồm 10 chữ số!" });
    }

    if (!nameRegex.test(full_name)) {
      return res.status(400).json({ message: "Họ tên không hợp lệ!" });
    }

    // Kiểm tra mã số giảng viên bị trùng (nếu có thay đổi mã số)
    const existingLecturer = await Lecturer.findOne({
      lecturer_id,
      _id: { $ne: id }, // Không tính chính bản thân giảng viên đang được cập nhật
    });

    if (existingLecturer) {
      return res.status(400).json({ message: "Mã số giảng viên đã tồn tại!" });
    }

    let birthDate;
    if (birthday) {
      const [day, month, year] = birthday.split("/");
      birthDate = new Date(`${year}-${month}-${day}`);
    }

    const updatedLecturer = await Lecturer.findByIdAndUpdate(
      id,
      {
        lecturer_id,
        full_name,
        email,
        phone,
        birthday: birthDate,
        department,
        password,
      },
      { new: true } // Trả về dữ liệu đã cập nhật
    );

    if (!updatedLecturer) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });
    }

    res.status(200).json({
      message: "Cập nhật giảng viên thành công",
      lecturer: updatedLecturer,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật giảng viên:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật giảng viên" });
  }
});

// API lấy thông tin của một giảng viên theo ID
app.get("/api/lecturers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lecturer = await Lecturer.findById(id);

    if (!lecturer) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });
    }

    res.status(200).json(lecturer); // Trả về trực tiếp, không format birthday
  } catch (err) {
    console.error("Lỗi khi truy xuất thông tin giảng viên:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi truy xuất thông tin giảng viên" });
  }
});

const generatePasswordFromBirthday = (birthday) => {
  if (!birthday) return "";
  const [day, month, year] = birthday.split("/");
  return `${day}${month}${year}`;
};

// Khởi động server
app.listen(5000, () => console.log("Server chạy tại http://localhost:5000"));
