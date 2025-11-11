// src/components/layout/Header.jsx
import { useState } from "react";
import { FiMenu, FiSearch, FiShoppingCart, FiX } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext.jsx";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const { cart } = useCart();

  const navLinks = [
    { name: "Giày Nam", href: "/products/giay-nam" },
    { name: "Giày Nữ", href: "/products/giay-nu" },
    { name: "Dép", href: "/products/dep" },
    { name: "Khuyến Mãi", href: "/products/khuyen-mai", special: true },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-500">
          ShopGiay
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) => `
                                pb-1
                                ${
                                  isActive
                                    ? "text-orange-500 border-b-2 border-orange-500"
                                    : "text-gray-600 hover:text-orange-500"
                                }
                                ${
                                  link.special
                                    ? "text-red-500 font-semibold"
                                    : ""
                                }
                            `}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {/* Thanh tìm kiếm Desktop */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-full py-2 px-4 pl-10 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiSearch />
            </button>
          </form>

          <Link
            to="/cart"
            className="text-gray-600 hover:text-orange-500 relative"
          >
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.items.reduce((total, item) => total + item.soLuong, 0)}
            </span>
          </Link>
          {token ? (
            <div
              onClick={() => navigate("/account")}
              className="flex items-center space-x-2 cursor-pointer hover:text-orange-500"
            >
              <FiUser size={22} />
              <span className="text-gray-700 text-sm font-medium">
                {username}
              </span>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Đăng Nhập
            </Link>
          )}
        </div>

        {/* Mobile buttons */}
        <div className="md:hidden flex items-center space-x-3">
          <Link to="/cart" className="text-gray-600 hover:text-orange-500">
            <FiShoppingCart size={24} />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
          <nav className="flex flex-col p-4 space-y-2">
            {/* Thanh tìm kiếm Mobile */}
            <form onSubmit={handleSearch} className="relative mb-2">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-full py-2 px-4 pl-10 w-full text-sm"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiSearch />
              </button>
            </form>

            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                                    p-2 rounded
                                    ${
                                      isActive
                                        ? "bg-orange-100 text-orange-500"
                                        : "text-gray-700"
                                    }
                                    ${
                                      link.special
                                        ? "text-red-500 font-semibold"
                                        : ""
                                    }
                                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            {token ? (
              <div
                onClick={() => {
                  navigate("/account");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 p-2 rounded text-gray-700"
              >
                <FiUser size={22} />
                <span>{username}</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng Nhập
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
