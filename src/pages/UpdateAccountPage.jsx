import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiArrowLeft,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const UpdateAccountPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    diaChi: "",
    diemTichLuy: 0,
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        toast.error("Vui lòng đăng nhập.");
        navigate("/login");
        return;
      }

      try {
        const response = await api.get(`/khachhang/${username}`);

        setFormData({
          hoTen: response.hoTen || "",
          email: response.email || "",
          sdt: response.sdt || "",
          diaChi: response.diaChi || "",
          diemTichLuy: response.diemTichLuy || 0,
        });
      } catch (err) {
        console.error("Lỗi tải thông tin khách hàng:", err);
        toast.error("Không thể tải thông tin khách hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [navigate]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;
    const NAME_FORMAT_REGEX = /^([A-ZÀÁẢÃẠĂẮẰẶẴẲÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆĐ][a-zàáảãạăắằặẵẳâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵa-z]*)(?:\s[A-ZÀÁẢÃẠĂẮẰẶẴẲÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆĐ][a-zàáảãạăắằặẵẳâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵa-z]*)*$/;

    if (!formData.hoTen.trim()) {
      tempErrors.hoTen = "Họ tên không được để trống.";
      isValid = false;
    } else if (!NAME_FORMAT_REGEX.test(formData.hoTen.trim())) {
      tempErrors.hoTen = "Họ tên phải viết hoa chữ cái đầu của mỗi từ (Ví dụ: Nguyễn Văn A).";
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Email không hợp lệ.";
      isValid = false;
    }

    if (!/^\d{10}$/.test(formData.sdt)) {
      tempErrors.sdt = "Số điện thoại phải có 10 chữ số.";
      isValid = false;
    }

    const addressParts = formData.diaChi.split(',');
    if (addressParts.length !== 4) {
      tempErrors.diaChi = "Địa chỉ phải bao gồm: số nhà/đường, phường/xã, quận/huyện/ tỉnh/thành phố. (phân cách bằng dấu phẩy).";
      isValid = false;
    } else {
      const hasEmptyPart = addressParts.some(part => part.trim() === '');
      if (hasEmptyPart) {
        tempErrors.diaChi = "Vui lòng nhập đầy đủ nội dung cho 4 phần địa chỉ.";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra và sửa các lỗi trong form.");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) return;

    setIsSubmitting(true);

    const normalizedAddress = formData.diaChi.split(',')
      .map(part => part.trim())
      .join(', ');

    try {
      await api.put(`/khachhang/update/${username}`, {
        hoTen: formData.hoTen,
        email: formData.email,
        sdt: formData.sdt,
        diaChi: normalizedAddress,
      });
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none";

  const getInputClass = (field) =>
    `${inputClass} ${errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`;


  if (loading) return <div className="text-center py-10">Đang tải thông tin...</div>;
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-left" />

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
                className={`pl-10 ${getInputClass('hoTen')}`}
              />
            </div>
            {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>}
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
                className={`pl-10 ${getInputClass('email')}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                className={`pl-10 ${getInputClass('sdt')}`}
              />
            </div>
            {errors.sdt && <p className="text-red-500 text-xs mt-1">{errors.sdt}</p>}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Địa chỉ (Số nhà/Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP)
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Ví dụ: 123 Nguyễn Huệ, Bến Nghé, Quận 1, TP HCM"
                name="diaChi"
                value={formData.diaChi}
                onChange={(e) => handleChange("diaChi", e.target.value)}
                className={`pl-10 ${getInputClass('diaChi')}`}
              />
            </div>
            {errors.diaChi && <p className="text-red-500 text-xs mt-1">{errors.diaChi}</p>}
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
                className={`pl-10 bg-gray-100 cursor-not-allowed ${inputClass} border-gray-300`} // Không cần getInputClass vì readonly
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccountPage;