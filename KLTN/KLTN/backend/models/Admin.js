import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model("admin", adminSchema, "admin");
export default Admin;
