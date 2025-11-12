// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiTruck,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import shop from "../assets/image/shop.png";
import { useCart } from "../contexts/CartContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUsername: setCartUsername, setCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8085/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        setLoading(false);
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("roles", JSON.stringify(data.roles || []));

      // --- quan trọng: cập nhật username cho CartProvider ---
      setCartUsername(data.username);
      const saved = localStorage.getItem(`cart_${data.username}`);
      if (saved) setCart(JSON.parse(saved));
      else setCart({ items: [], maKhuyenMai: null, diemSuDung: 0 });
      alert("Đăng nhập thành công!");
      if (data.roles && data.roles.includes("ROLE_ADMIN")) navigate("/admin");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Có lỗi khi kết nối server!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white min-h-full py-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Chào mừng đến với <br />
              <span className="text-brand-orange">ShopGiay</span>
            </h1>
            <p className="text-lg text-gray-300">
              Khám phá bộ sưu tập giày dép thời trang cao cấp với phong cách
              hiện đại và chất lượng tuyệt vời
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <InfoBox
                icon={<FiTruck size={24} />}
                title="Giao hàng nhanh"
                description="Miễn phí giao hàng toàn quốc"
              />
              <InfoBox
                icon={<FiShield size={24} />}
                title="Bảo hành 12 tháng"
                description="Đổi trả dễ dàng"
              />
            </div>

            <img
              src={shop}
              alt="Cửa hàng ShopGiay"
              className="w-full h-auto rounded-2xl shadow-2xl object-cover transition-transform duration-500 hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,107,53,0.3)]"
            />
          </div>

          <div className="bg-white text-gray-900 p-8 md:p-12 rounded-2xl shadow-2xl">
            <div className="flex mb-8 border-b border-gray-200">
              <button className="flex-1 py-3  font-semibold text-brand-orange border-b-2 border-brand-orange transition-colors">
                Đăng nhập
              </button>
              <Link
                to="/register"
                className="flex-1 py-3 text-center font-semibold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Đăng ký
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              Đăng nhập tài khoản
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Chào mừng bạn quay trở lại
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 px-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded text-brand-orange focus:ring-brand-orange"
                  />
                  <label htmlFor="remember" className="text-gray-600">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="font-medium text-brand-orange hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SocialButton icon={<FcGoogle size={22} />} text="Google" />
                <SocialButton
                  icon={<FaFacebook size={22} className="text-blue-600" />}
                  text="Facebook"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Các props {icon, title, description} sẽ không còn bị báo lỗi
const InfoBox = ({ icon, title, description }) => (
  <div className="bg-gray-800/60 p-6 rounded-lg flex items-center gap-5 backdrop-blur-sm">
    <div className="flex-shrink-0 bg-brand-orange/20 text-brand-orange p-3 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-white text-lg">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

// Các props {icon, text} sẽ không còn bị báo lỗi
const SocialButton = ({ icon, text }) => (
  <button
    type="button"
    className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors"
  >
    {icon}
    <span className="font-medium text-gray-700">{text}</span>
  </button>
);

export default LoginPage;
