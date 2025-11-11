import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiArrowLeft,
} from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateAccountPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    diaChi: "",
    diemTichLuy: 0,
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Thông tin cập nhật:", formData);
    alert("Form submit (chưa kết nối API)");
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-4 hover:text-orange-500 transition"
        >
          <FiArrowLeft className="mr-2" /> Quay lại
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Cập nhật thông tin cá nhân
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={formData.hoTen}
                onChange={(e) => handleChange("hoTen", e.target.value)}
                className={`pl-10 ${inputClass}`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`pl-10 ${inputClass}`}
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={formData.sdt}
                onChange={(e) => handleChange("sdt", e.target.value)}
                className={`pl-10 ${inputClass}`}
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập địa chỉ"
                value={formData.diaChi}
                onChange={(e) => handleChange("diaChi", e.target.value)}
                className={`pl-10 ${inputClass}`}
              />
            </div>
          </div>

          {/* Điểm tích lũy (readonly) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Điểm tích lũy
            </label>
            <div className="relative">
              <FiStar className="absolute left-3 top-3 text-orange-500" />
              <input
                type="text"
                value={formData.diemTichLuy}
                readOnly
                className={`pl-10 bg-gray-100 cursor-not-allowed ${inputClass}`}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Lưu thông tin
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccountPage;
