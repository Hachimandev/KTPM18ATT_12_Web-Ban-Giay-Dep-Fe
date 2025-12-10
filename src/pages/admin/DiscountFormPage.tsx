import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTag, FiCalendar, FiDollarSign } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import * as api from "../../api/api";

const DiscountFormPage = () => {
  const navigate = useNavigate();
  const { maKhuyenMai } = useParams();

  const isEditMode = !!maKhuyenMai;

  const [formData, setFormData] = useState({
    maKhuyenMai: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    dieuKien: "",
    chietKhau: 0,
    // Giả định bạn lưu maNhanVien của Admin đang đăng nhập vào localStorage
    maNhanVien: localStorage.getItem("maNhanVien") || "NV001",
  });
  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  // --- 1. LOAD DỮ LIỆU KHI CHỈNH SỬA ---
  useEffect(() => {
    if (isEditMode) {
      const fetchPromotion = async () => {
        try {
          const item = await api.get(`/khuyenmai/${maKhuyenMai}`);

          setFormData({
            maKhuyenMai: item.maKhuyenMai || "",
            ngayBatDau: item.ngayBatDau
              ? new Date(item.ngayBatDau).toISOString().substring(0, 10)
              : "",
            ngayKetThuc: item.ngayKetThuc
              ? new Date(item.ngayKetThuc).toISOString().substring(0, 10)
              : "",
            dieuKien: item.dieuKien || "",
            chietKhau: item.chietKhau || 0,
            maNhanVien:
              item.nhanVien?.maNhanVien ||
              localStorage.getItem("maNhanVien") ||
              "NV001",
          });
        } catch (err) {
          toast.error("Không tìm thấy khuyến mãi để chỉnh sửa.");
          navigate("/admin/discounts");
        } finally {
          setLoading(false);
        }
      };
      fetchPromotion();
    }
  }, [isEditMode, maKhuyenMai, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "number" && value !== "" ? parseFloat(value) : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // --- 2. CLIENT-SIDE VALIDATION ĐẦY ĐỦ ---
  const validate = () => {
    /** @type {Record<string, string | null>} */
    let tempErrors = {};
    let isValid = true;

    // 1. Mã Khuyến mãi (Chỉ kiểm tra khi Chỉnh sửa)
    if (isEditMode && !formData.maKhuyenMai.trim()) {
      tempErrors.maKhuyenMai = "Mã KM không được trống.";
      isValid = false;
    }

    // 2. Ngày Bắt đầu
    if (!formData.ngayBatDau) {
      tempErrors.ngayBatDau = "Ngày bắt đầu không được trống.";
      isValid = false;
    }

    // 3. Ngày Kết thúc
    if (!formData.ngayKetThuc) {
      tempErrors.ngayKetThuc = "Ngày kết thúc không được trống.";
      isValid = false;
    } else if (
      new Date(formData.ngayBatDau) >= new Date(formData.ngayKetThuc)
    ) {
      tempErrors.ngayKetThuc = "Ngày kết thúc phải sau ngày bắt đầu.";
      isValid = false;
    }

    // 4. Chiết khấu
    if (typeof formData.chietKhau !== "number" || formData.chietKhau <= 0) {
      tempErrors.chietKhau = "Chiết khấu phải là số dương.";
      isValid = false;
    }

    // 5. Điều kiện áp dụng
    if (!formData.dieuKien.trim()) {
      tempErrors.dieuKien = "Điều kiện không được trống.";
      isValid = false;
    } else if (formData.dieuKien.length > 255) {
      tempErrors.dieuKien = "Điều kiện không được quá 255 ký tự.";
      isValid = false;
    }

    // 6. Mã Nhân viên (Kiểm tra nếu mã nhân viên không lấy được từ localStorage)
    if (!formData.maNhanVien.trim()) {
      tempErrors.maNhanVien =
        "Không thể xác định Mã Nhân viên (Vui lòng đăng nhập lại).";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // --- 3. SUBMIT HANDLER (Giữ nguyên) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Vui lòng kiểm tra các lỗi trong form.");
      return;
    }

    setIsSubmitting(true);
    const url = isEditMode ? `/khuyenmai/${maKhuyenMai}` : "/khuyenmai";
    const method = isEditMode ? api.put : api.post;

    // Chuẩn bị dữ liệu gửi đi (Loại bỏ maKhuyenMai khi thêm mới)
    const dataToSend = isEditMode
      ? formData
      : (({ maKhuyenMai, ...rest }) => rest)(formData);

    try {
      await method(url, dataToSend);
      toast.success(
        isEditMode
          ? "Cập nhật khuyến mãi thành công!"
          : "Tạo khuyến mãi mới thành công!"
      );
      navigate("/admin/discounts");
    } catch (err) {
      const errorMessage =
        err.message?.substring(0, 100) || "Lỗi server không xác định.";
      toast.error(`Thao tác thất bại: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UTILS RENDER ---
  const getInputClass = (field) =>
    `w-full pl-10 pr-3 py-2 border rounded-lg text-sm ${
      errors[field]
        ? "border-red-500"
        : "border-gray-300 focus:ring-orange-400 focus:border-orange-400 outline-none"
    }`;

  if (loading)
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {/* Header */}
        <button
          onClick={() => navigate("/admin/discounts")}
          className="flex items-center text-gray-600 mb-6 hover:text-orange-500 transition"
        >
          <FiArrowLeft className="mr-2" /> Quay lại danh sách
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          {isEditMode ? `Chỉnh sửa KM: ${maKhuyenMai}` : "Tạo Khuyến mãi mới"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mã Khuyến mãi - CHỈ HIỂN THỊ KHI CHỈNH SỬA VÀ KHÓA LẠI */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Mã Khuyến mãi
              </label>
              <div className="relative">
                <FiTag className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="maKhuyenMai"
                  value={formData.maKhuyenMai}
                  placeholder="Được tự động sinh ra"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm bg-gray-100 cursor-not-allowed`}
                  disabled
                />
              </div>
              {errors.maKhuyenMai && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maKhuyenMai}
                </p>
              )}
            </div>
          )}

          {/* Ngày Bắt đầu & Ngày Kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            {/* Ngày Bắt đầu */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày Bắt đầu
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="ngayBatDau"
                  value={formData.ngayBatDau}
                  onChange={handleChange}
                  className={getInputClass("ngayBatDau")}
                />
              </div>
              {errors.ngayBatDau && (
                <p className="text-red-500 text-xs mt-1">{errors.ngayBatDau}</p>
              )}
            </div>
            {/* Ngày Kết thúc */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày Kết thúc
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="ngayKetThuc"
                  value={formData.ngayKetThuc}
                  onChange={handleChange}
                  className={getInputClass("ngayKetThuc")}
                />
              </div>
              {errors.ngayKetThuc && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ngayKetThuc}
                </p>
              )}
            </div>
          </div>

          {/* Chiết khấu */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chiết khấu (0.1 = 10% / 50000 = 50,000đ)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                name="chietKhau"
                value={formData.chietKhau}
                onChange={handleChange}
                step="0.01"
                placeholder="Nhập giá trị chiết khấu"
                className={getInputClass("chietKhau")}
              />
            </div>
            {errors.chietKhau && (
              <p className="text-red-500 text-xs mt-1">{errors.chietKhau}</p>
            )}
          </div>

          {/* Điều kiện áp dụng */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Điều kiện áp dụng
            </label>
            <textarea
              name="dieuKien"
              value={formData.dieuKien}
              onChange={handleChange}
              rows="3"
              placeholder="Mô tả điều kiện (Ví dụ: Đơn hàng > 500,000đ)"
              className={`w-full p-3 border rounded-lg text-sm ${
                errors.dieuKien
                  ? "border-red-500"
                  : "border-gray-300 focus:ring-orange-400 focus:border-orange-400 outline-none"
              }`}
            />
            {errors.dieuKien && (
              <p className="text-red-500 text-xs mt-1">{errors.dieuKien}</p>
            )}
          </div>

          {/* Mã Nhân viên tạo/chỉnh sửa */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã Nhân viên tạo/chỉnh sửa
            </label>
            <input
              type="text"
              name="maNhanVien"
              value={formData.maNhanVien}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg text-sm bg-gray-100 cursor-not-allowed`}
              readOnly
              disabled
            />
            {errors.maNhanVien && (
              <p className="text-red-500 text-xs mt-1">{errors.maNhanVien}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Dữ liệu này được lấy từ thông tin đăng nhập.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/discounts")}
              className="px-6 py-3 text-gray-700 border rounded-lg hover:bg-gray-100 transition font-medium"
              disabled={isSubmitting}
            >
              Hủy & Quay lại
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật Khuyến mãi"
                : "Tạo mới Khuyến mãi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountFormPage;
