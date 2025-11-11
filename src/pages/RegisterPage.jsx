// @ts-nocheck
import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaFacebook,
  FaGoogle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    const newSuccess = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ và tên";
    else newSuccess.fullName = true;

    if (!formData.username.trim())
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    else newSuccess.username = true;

    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    else newSuccess.email = true;

    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else newSuccess.password = true;

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp";
    else newSuccess.confirmPassword = true;

    if (!formData.agree)
      newErrors.agree = "Vui lòng đồng ý với Điều khoản và Chính sách bảo mật";
    else newSuccess.agree = true;

    setErrors(newErrors);
    setSuccess(newSuccess);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
    setSuccess({ ...success, [field]: false });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8085/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const text = await res.text();

      if (text === "Username exists") {
        setErrors({ username: "Tên đăng nhập đã tồn tại" });
        setSuccess({});
      } else if (text === "Email exists") {
        setErrors({ email: "Email đã được sử dụng" });
        setSuccess({});
      } else if (text === "Registered") {
        setSuccess({
          fullName: true,
          username: true,
          email: true,
          password: true,
          confirmPassword: true,
          agree: true,
        });

        const loginRes = await fetch("http://localhost:8085/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          localStorage.setItem("roles", JSON.stringify(data.roles));

          alert("Đăng ký tài khoản thành công!");
          navigate("/login");
        } else {
          alert("Đăng ký thành công");
          navigate("/login");
        }
      } else {
        alert("Lỗi không xác định từ server: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none ${
      errors[field]
        ? "border-red-400"
        : success[field]
        ? "border-green-400"
        : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <span className="ml-2 text-4xl font-bold text-gray-800">
              ShopGiay
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-1">Đăng ký tài khoản</h2>
          <p className="text-gray-500 text-sm">
            Tạo tài khoản để trải nghiệm mua sắm tuyệt vời
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập họ và tên của bạn"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={`pl-10 ${inputClass("fullName")}`}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.fullName}
              </p>
            )}
            {success.fullName && (
              <p className="text-green-500 text-xs mt-1 flex items-center">
                <FaCheckCircle className="mr-1" /> Hợp lệ
              </p>
            )}
          </div>

          {/* Tên đăng nhập */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={`pl-10 ${inputClass("username")}`}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.username}
              </p>
            )}
            {success.username && (
              <p className="text-green-500 text-xs mt-1 flex items-center">
                <FaCheckCircle className="mr-1" /> Hợp lệ
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`pl-10 ${inputClass("email")}`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.email}
              </p>
            )}
            {success.email && (
              <p className="text-green-500 text-xs mt-1 flex items-center">
                <FaCheckCircle className="mr-1" /> Hợp lệ
              </p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`pl-10 pr-10 ${inputClass("password")}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-orange-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.password}
              </p>
            )}
            {success.password && (
              <p className="text-green-500 text-xs mt-1 flex items-center">
                <FaCheckCircle className="mr-1" /> Hợp lệ
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className={`pl-10 pr-10 ${inputClass("confirmPassword")}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-orange-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" />{" "}
                {errors.confirmPassword}
              </p>
            )}
            {success.confirmPassword && (
              <p className="text-green-500 text-xs mt-1 flex items-center">
                <FaCheckCircle className="mr-1" /> Hợp lệ
              </p>
            )}
          </div>

          {/* Checkbox */}
          <div className="flex items-start text-sm">
            <input
              type="checkbox"
              checked={formData.agree}
              onChange={(e) => handleChange("agree", e.target.checked)}
              className={`mt-1 mr-2 accent-orange-500 ${
                errors.agree ? "border-red-500" : ""
              }`}
            />
            <label className="text-gray-600">
              Tôi đồng ý với{" "}
              <span className="text-orange-500 hover:underline cursor-pointer">
                Điều khoản dịch vụ
              </span>{" "}
              và{" "}
              <span className="text-orange-500 hover:underline cursor-pointer">
                Chính sách bảo mật
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          {/* Hoặc đăng ký bằng */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-gray-400 text-sm">
              Hoặc đăng ký bằng
            </span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google / Facebook */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center border border-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              <FaGoogle className="text-red-500 mr-2" />
              Đăng ký với Google
            </button>
            <button className="w-full flex items-center justify-center border border-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              <FaFacebook className="text-blue-600 mr-2" />
              Đăng ký với Facebook
            </button>
          </div>

          {/* Đã có tài khoản */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Đã có tài khoản?{" "}
            <a
              href="#"
              onClick={() => navigate("/login")}
              className="text-orange-500 font-medium hover:underline"
            >
              Đăng nhập ngay
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
