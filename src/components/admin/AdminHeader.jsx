// src/components/admin/AdminHeader.jsx
// @ts-nocheck
import { FiBell, FiSearch, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // 💡 IMPORT useNavigate

const AdminHeader = () => {
    // 💡 KHỞI TẠO NAVIGATE
    const navigate = useNavigate();

    // 💡 HÀM CHUYỂN HƯỚNG TỚI TRANG ĐỔI MẬT KHẨU
    const handleChangePasswordClick = () => {
        navigate('/admin/change-password');
    };

    return (
        <div className="flex justify-end items-center gap-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="border rounded-full py-2 px-4 pl-10 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Nút Thông báo (Giữ nguyên) */}
            <button className="relative text-gray-600 hover:text-[#F97316]">
                <FiBell size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                </span>
            </button>

            {/* 💡 NÚT SETTINGS CHUYỂN HƯỚNG */}
            <button
                onClick={handleChangePasswordClick} // GỌI HÀM CHUYỂN HƯỚNG
                className="text-gray-600 hover:text-[#F97316] transition-colors"
            >
                <FiSettings size={22} className="hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>
    );
};

export default AdminHeader;