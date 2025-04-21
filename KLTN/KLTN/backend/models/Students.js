import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  student_id: String,
  full_name: String,
  email: String,
  phone: String,
  birthday: Date, // ✅ Thay đổi kiểu dữ liệu thành Date
  department: String,
  major: String,
  password: String,
  created_at: { type: Date, default: Date.now }, // Thêm created_at với giá trị mặc định
});

const Student = mongoose.model("student", studentSchema, "student"); // tên collection là "students"
export default Student;
