// src/components/layout/Header.jsx
import { useState } from 'react';
import { FiMenu, FiSearch, FiShoppingCart, FiX } from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom'; // <-- Dùng Link và NavLink

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Giày Nam', href: '/giay-nam' },
        { name: 'Giày Nữ', href: '/giay-nu' },
        { name: 'Dép', href: '/dep' },
        { name: 'Khuyến Mãi', href: '/khuyen-mai', special: true },
    ];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-brand-orange">
                    ShopGiay
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) => `
                pb-1
                ${isActive ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-600 hover:text-brand-orange'}
                ${link.special ? 'text-red-500 font-semibold' : ''}
              `}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="border rounded-full py-2 px-4 pl-10 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <Link to="/cart" className="text-gray-600 hover:text-brand-orange relative">
                        <FiShoppingCart size={24} />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            0
                        </span>
                    </Link>
                    <Link
                        to="/login"
                        className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                    >
                        Đăng Nhập
                    </Link>
                </div>

                <div className="md:hidden flex items-center space-x-3">
                    <Link to="/cart" className="text-gray-600 hover:text-brand-orange"><FiShoppingCart size={24} /></Link>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
                    <nav className="flex flex-col p-4 space-y-2">
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="border rounded-full py-2 px-4 pl-10 w-full text-sm"
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.href}
                                className={({ isActive }) => `
                  p-2 rounded
                  ${isActive ? 'bg-orange-100 text-brand-orange' : 'text-gray-700'}
                  ${link.special ? 'text-red-500 font-semibold' : ''}
                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <Link
                            to="/login"
                            className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-medium text-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Đăng Nhập
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;