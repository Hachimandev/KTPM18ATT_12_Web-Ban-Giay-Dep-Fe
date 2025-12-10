import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 💡 IMPORT thêm FiEye và FiEyeOff
import { FiArrowLeft, FiLock, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import * as api from "../api/api";

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 💡 STATE MỚI ĐỂ QUẢN LÝ ẨN/HIỆN
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors((prev) => ({ ...prev, [field]: null }));
    };

    // 💡 HÀM CHUYỂN ĐỔI ẨN/HIỆN
    const togglePasswordVisibility = () => {
        setShowNewPassword(prev => !prev);
    };

    const validateForm = () => {
        // ... (Logic validation giữ nguyên) ...
        /** @type {Record<string, string | null>} */
        let tempErrors = {};
        let isValid = true;

        if (!formData.oldPassword.trim()) {
            tempErrors.oldPassword = "Mật khẩu cũ không được trống.";
            isValid = false;
        }

        if (!formData.newPassword || formData.newPassword.length < 6) {
            tempErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            tempErrors.confirmNewPassword = "Xác nhận mật khẩu không khớp.";
            isValid = false;
        }

        if (formData.newPassword === formData.oldPassword && formData.newPassword.length >= 6) {
            tempErrors.newPassword = "Mật khẩu mới phải khác mật khẩu cũ.";
            isValid = false;
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

        setIsSubmitting(true);

        const requestData = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
        };

        try {
            const username = localStorage.getItem("username");
            await api.put("/taikhoan/change-password/" + username, requestData);

            toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            const message = err.message || "Lỗi không xác định khi đổi mật khẩu.";
            toast.error(`Thất bại: ${message.substring(0, 50)}`);
            console.error("Lỗi đổi mật khẩu:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none";
    const getInputClass = (field) =>
        `${inputClass} ${errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-400'}`;

    // Xác định type của input mật khẩu mới dựa trên state
    const passwordInputType = showNewPassword ? "text" : "password";

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <Toaster position="top-left" />

            <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 mb-4 hover:text-orange-500 transition"
                >
                    <FiArrowLeft className="mr-2" /> Quay lại
                </button>

                <h2 className="text-xl font-semibold text-center mb-4">
                    Thay đổi Mật khẩu
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Mật khẩu cũ */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
                        <div className="relative">
                            <FiKey className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password" // Luôn là password
                                placeholder="Nhập mật khẩu cũ"
                                value={formData.oldPassword}
                                onChange={(e) => handleChange("oldPassword", e.target.value)}
                                className={`pl-10 ${getInputClass('oldPassword')}`}
                                required
                            />
                        </div>
                        {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
                    </div>

                    {/* Mật khẩu mới - CÓ NÚT ẨN/HIỆN */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type={passwordInputType} // 💡 SỬ DỤNG STATE ĐỂ CHUYỂN ĐỔI TYPE
                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                value={formData.newPassword}
                                onChange={(e) => handleChange("newPassword", e.target.value)}
                                className={`pl-10 pr-10 ${getInputClass('newPassword')}`} // Tăng pr để chừa chỗ cho icon
                                required
                            />
                            {/* 💡 NÚT ẨN/HIỆN */}
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                    </div>

                    {/* Xác nhận mật khẩu mới - CÓ NÚT ẨN/HIỆN */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type={passwordInputType} // 💡 SỬ DỤNG STATE ĐỂ CHUYỂN ĐỔI TYPE
                                placeholder="Xác nhận mật khẩu mới"
                                value={formData.confirmNewPassword}
                                onChange={(e) => handleChange("confirmNewPassword", e.target.value)}
                                className={`pl-10 pr-10 ${getInputClass('confirmNewPassword')}`} // Tăng pr để chừa chỗ cho icon
                                required
                            />
                            {/* 💡 NÚT ẨN/HIỆN */}
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;