import { useState, useEffect } from "react";
import axios from "axios";

const majorsByDepartment = {
  "Công nghệ thông tin": [
    "Khoa học máy tính",
    "Kỹ thuật phần mềm",
    "Hệ thống Thông tin",
  ],
  "Quản trị kinh doanh": [
    "Quản trị Logistics",
    "Quản trị Makerting",
    "Digital Markerting",
    "Quản trị nhân sự",
  ],
};

const StudentForm = ({ onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    student_id: "",
    full_name: "",
    email: "",
    phone: "",
    birthday: "", // Lưu trữ ở định dạng yyyy-MM-DD cho input date
    department: "",
    major: "",
  });

  const [errors, setErrors] = useState({});
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const maxSelectableDate = eighteenYearsAgo.toISOString().split("T")[0];

  useEffect(() => {
    if (initialData) {
      setFormData({
        student_id: initialData.student_id || "",
        full_name: initialData.full_name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        birthday: initialData.birthday || "", // Gán trực tiếp
        department: initialData.department || "",
        major: initialData.major || "",
      });
    } else {
      setFormData({
        student_id: "",
        full_name: "",
        email: "",
        phone: "",
        birthday: "",
        department: "",
        major: "",
      });
      setErrors({});
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        major: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const nameRegex = /^[\p{L}\s]+$/u;

    let validationErrors = {};

    if (!nameRegex.test(formData.full_name)) {
      validationErrors.full_name =
        "Họ tên không hợp lệ (chỉ chữ cái và khoảng trắng)";
    }

    if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Email không hợp lệ";
    }

    if (!phoneRegex.test(formData.phone)) {
      validationErrors.phone = "Số điện thoại phải gồm 10 chữ số";
    }

    if (!formData.birthday) {
      validationErrors.birthday = "Vui lòng chọn ngày sinh";
    } else {
      const birthDate = new Date(formData.birthday);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      if (birthDate > eighteenYearsAgo) {
        validationErrors.birthday = "Sinh viên phải đủ 18 tuổi trở lên";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const formattedBirthday = formData.birthday
      ? formatDateToSend(formData.birthday)
      : "";

    const dataToSend = {
      ...formData,
      birthday: formattedBirthday, // Sử dụng ngày sinh đã format
    };

    try {
      if (initialData && initialData._id) {
        await axios.put(
          `http://localhost:5000/api/students/${initialData._id}`,
          dataToSend
        );
        onSuccess();
      } else {
        await axios.post("http://localhost:5000/api/students", dataToSend);
        onSuccess();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        if (
          error.response.data.message.includes("Mã số sinh viên đã tồn tại!")
        ) {
          setErrors({ student_id: error.response.data.message });
        } else if (
          error.response.data.message.includes(
            "Địa chỉ email này đã được sử dụng!"
          )
        ) {
          setErrors({ email: error.response.data.message });
        } else if (
          error.response.data.message.includes("Ngày sinh không hợp lệ")
        ) {
          setErrors({ birthday: error.response.data.message });
        } else {
          console.error("Lỗi khi thêm/sửa sinh viên:", error);
        }
      } else {
        console.error("Lỗi khi thêm/sửa sinh viên:", error);
      }
    }
  };

  /// Hàm format ngày thành DD/MM/YYYY
  const formatDateToSend = (dateString) => {
    console.log("formatDateToSend nhận:", dateString); // Kiểm tra đầu vào
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formatted = `${day}/${month}/${year}`; // Sửa ở đây: trả về chuỗi đúng định dạng
    console.log("formatDateToSend trả về:", formatted); // Kiểm tra đầu ra
    return formatted;
  };

  const availableMajors = majorsByDepartment[formData.department] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Mã sinh viên</label>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
            className={`w-full border rounded px-3 py-2 ${
              errors.student_id ? "border-red-500" : ""
            }`}
          />
          {errors.student_id && (
            <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Họ và tên</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className={`w-full border rounded px-3 py-2 ${
              errors.full_name ? "border-red-500" : ""
            }`}
          />
          {errors.full_name && (
            <p className="text-red-600 text-sm mt-1">{errors.full_name}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full border rounded px-3 py-2 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full border rounded px-3 py-2 ${
              errors.phone ? "border-red-500" : ""
            }`}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Ngày sinh</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
            max={maxSelectableDate}
            className={`w-full border rounded px-3 py-2 ${
              errors.birthday ? "border-red-500" : ""
            }`}
          />
          {errors.birthday && (
            <p className="text-red-600 text-sm mt-1">{errors.birthday}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Khoa</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Chọn khoa --</option>
            {Object.keys(majorsByDepartment).map((dep, idx) => (
              <option key={idx} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Chuyên ngành</label>
          <select
            name="major"
            value={formData.major}
            onChange={handleChange}
            required
            disabled={!formData.department}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Chọn chuyên ngành --</option>
            {availableMajors.map((m, idx) => (
              <option key={idx} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
        >
          {initialData ? "Lưu Thay Đổi" : "Thêm sinh viên"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
