import { useEffect, useState } from "react";
import axios from "axios";
import StudentForm from "D:/KLTN-Website/KLTN/KLTN/src/components/ui/Form_Add_Student.jsx";
import { Edit, Trash2 } from "lucide-react";

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

const Students = () => {
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState("");
  const [major, setMajor] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students", {
        params: { department, major, search },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department, major, search]);

  const availableMajors = majorsByDepartment[department] || [];

  const handleEdit = (student) => {
    setSelectedStudent(student); // Truyền trực tiếp student, bao gồm birthday nguyên bản
    setShowForm(true); // mở form lên khi sửa
  };

  // ✅ Hàm XOÁ
  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá sinh viên này không?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents(); // load lại danh sách sau khi xoá
    } catch (err) {
      console.error("Lỗi khi xoá sinh viên:", err);
    }
  };

  // Hàm định dạng ngày tháng ở frontend
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return dateString; // Trả về nguyên bản nếu không định dạng được
    }
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Danh sách Sinh viên</h1>
      <div className="flex gap-4 mb-4">
        {/* Bộ lọc */}
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setMajor("");
          }}
          className="border rounded p-2"
        >
          <option value="">-- Chọn Khoa --</option>
          {Object.keys(majorsByDepartment).map((dep, idx) => (
            <option key={idx} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <select
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="border rounded p-2"
          disabled={availableMajors.length === 0}
        >
          <option value="">-- Chọn chuyên ngành --</option>
          {availableMajors.map((m, idx) => (
            <option key={idx} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc mã SV"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        <button
          onClick={() => {
            setSelectedStudent(null); // Reset selectedStudent khi thêm mới
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Thêm sinh viên
        </button>
      </div>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Mã SV</th>
            <th className="p-2">Họ tên</th>
            <th className="p-2">Email</th>
            <th className="p-2">SĐT</th>
            <th className="p-2">Ngày sinh</th>
            <th className="p-2">Khoa</th>
            <th className="p-2">Chuyên ngành</th>
            <th className="px-3 py-2 border text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{s.student_id}</td>
              <td className="p-2">{s.full_name}</td>
              <td className="p-2">{s.email}</td>
              <td className="p-2">{s.phone}</td>
              <td className="p-2">{formatDate(s.birthday)}</td>
              <td className="p-2">{s.department}</td>
              <td className="p-2">{s.major}</td>
              <td className="px-3 py-2 border text-center">
                <button
                  className="text-blue-600 hover:text-blue-800 mr-2"
                  onClick={() => handleEdit(s)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Bạn có chắc muốn xoá sinh viên này không?"
                      )
                    ) {
                      handleDelete(s._id);
                    }
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hiện Form đăng ký ở cửa sổ riêng */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative mt-20">
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedStudent(null); // Reset selectedStudent khi đóng form
              }}
              className="absolute top-2 right-2 text-red-500 font-bold text-lg"
            >
              ×
            </button>
            <StudentForm
              initialData={selectedStudent}
              onSuccess={() => {
                fetchStudents(); // Cập nhật danh sách
                setShowForm(false); // Đóng form
                setSelectedStudent(null); // Reset selectedStudent sau khi thành công
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;