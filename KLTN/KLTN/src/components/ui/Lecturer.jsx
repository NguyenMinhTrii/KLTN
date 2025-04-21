import { useEffect, useState } from "react";
import axios from "axios";
import LecturerForm from "D:/KLTN-Website/KLTN/KLTN/src/components/ui/Form_Add_Lecturer.jsx";
import { Edit, Trash2 } from "lucide-react";

// Cố định danh sách khoa
const departmentsData = ["Công nghệ thông tin", "Quản trị kinh doanh"];

const Lecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  const fetchLecturers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/lecturers", {
        params: { department, search },
      });
      setLecturers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu giảng viên:", err);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, [department, search]);

  const handleEdit = (lecturer) => {
    setSelectedLecturer({ ...lecturer, birthday: lecturer.birthday }); // Truyền trực tiếp birthday
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Bạn có chắc muốn xoá giảng viên này không?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/lecturers/${id}`);
      fetchLecturers();
    } catch (err) {
      console.error("Lỗi khi xoá giảng viên:", err);
    }
  };

  // ✅ Hiển thị ngoài bảng => dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return "";
    }
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Danh sách Giảng viên</h1>
      <div className="flex gap-4 mb-4">
        {/* Bộ lọc */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">-- Chọn Khoa --</option>
          {departmentsData.map((dep, idx) => (
            <option key={idx} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc mã GV"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        <button
          onClick={() => {
            setSelectedLecturer(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Thêm giảng viên
        </button>
      </div>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Mã GV</th>
            <th className="p-2">Họ tên</th>
            <th className="p-2">Email</th>
            <th className="p-2">SĐT</th>
            <th className="p-2">Ngày sinh</th>
            <th className="p-2">Khoa</th>
            <th className="px-3 py-2 border text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map((gv, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{gv.lecturer_id}</td>
              <td className="p-2">{gv.full_name}</td>
              <td className="p-2">{gv.email}</td>
              <td className="p-2">{gv.phone}</td>
              <td className="p-2">{formatDate(gv.birthday)}</td>
              <td className="p-2">{gv.department}</td>
              <td className="px-3 py-2 border text-center">
                <button
                  className="text-blue-600 hover:text-blue-800 mr-2"
                  onClick={() => handleEdit(gv)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Bạn có chắc muốn xoá giảng viên này không?"
                      )
                    ) {
                      handleDelete(gv._id);
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

      {/* Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative mt-20">
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedLecturer(null);
              }}
              className="absolute top-2 right-2 text-red-500 font-bold text-lg"
            >
              ×
            </button>
            <LecturerForm
              initialData={selectedLecturer}
              onSuccess={() => {
                fetchLecturers();
                setShowForm(false);
                setSelectedLecturer(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Lecturers;
