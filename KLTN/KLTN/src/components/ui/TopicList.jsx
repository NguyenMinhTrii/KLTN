import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/topics", {
        params: { search },
      });
      setTopics(response.data);
    } catch (err) {
      setError("Lỗi khi tải danh sách đề tài.");
      console.error("Lỗi tải danh sách đề tài:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [search]);

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
      return dateString;
    }
  };

  const handleEdit = (topic) => {
    // TODO: Implement chức năng chỉnh sửa đề tài
    console.log("Chỉnh sửa đề tài:", topic);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa đề tài này không?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/topics/${id}`);
      fetchTopics(); // Load lại danh sách sau khi xóa
      alert("Xóa đề tài thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa đề tài:", err);
      setError("Lỗi khi xóa đề tài.");
    }
  };

  if (loading) {
    return <div>Đang tải danh sách đề tài...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách Đề tài</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên đề tài..."
          className="w-full border rounded p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">STT</th>
            <th className="p-2">Tên đề tài</th>
            <th className="p-2">Mô tả</th>
            <th className="p-2">Ngày đăng ký</th>
            <th className="p-2">Trạng thái</th>
            <th className="px-3 py-2 border text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic, index) => (
            <tr key={topic._id} className="border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{topic.topic_name}</td>
              <td className="p-2">{topic.description}</td>
              <td className="p-2">{formatDate(topic.registration_date)}</td>
              <td className="p-2">{topic.status}</td>
              <td className="px-3 py-2 border text-center">
                <button
                  className="text-blue-600 hover:text-blue-800 mr-2"
                  onClick={() => handleEdit(topic)}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(topic._id)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {topics.length === 0 && (
            <tr>
              <td className="p-2 text-center" colSpan="6">
                Không có đề tài nào trong danh sách.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopicList;
