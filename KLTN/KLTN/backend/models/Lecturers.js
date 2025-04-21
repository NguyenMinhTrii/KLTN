import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema({
  lecturer_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  birthday: Date,
  department: String,
  password: String,
  created_at: { type: Date, default: Date.now },
});

const Lecturer = mongoose.model("lecturer", lecturerSchema, "lecturer");
export default Lecturer;
