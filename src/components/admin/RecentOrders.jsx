// src/components/admin/RecentOrders.jsx
// @ts-nocheck
import { Link } from 'react-router-dom';
import StatusBadge from '../admin/widgets/StatusBadge'; // Giả định bạn có component StatusBadge

// Sửa component để nhận orders qua props
const RecentOrders = ({ orders }) => {

    // StatusBadge logic (Cần đảm bảo component này nhận được ENUM status)
    const statusMap = {
        CHO_XAC_NHAN: "Chờ xác nhận",
        DANG_GIAO: "Đang giao",
        DA_GIAO: "Đã giao",
        DA_HUY: "Đã hủy",
        TRA_HANG: "Trả hàng",
        CHO_HUY: "Yêu cầu hủy",
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h2>

                <Link to="/admin/orders" className="text-sm font-medium text-[#F97316] hover:underline">
                    Xem tất cả
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-gray-500 p-4 border rounded-lg text-center">Không có đơn hàng gần đây nào.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="text-left text-sm text-gray-500 border-b">
                                <th className="py-3 px-4">Mã đơn</th>
                                <th className="py-3 px-4">Khách hàng</th>
                                <th className="py-3 px-4">Tổng tiền</th>
                                <th className="py-3 px-4">Trạng thái</th>
                                <th className="py-3 px-4">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.map((order) => (
                                <tr key={order.maHoaDon} className="text-gray-700 hover:bg-gray-50 transition">
                                    <td className="py-3 px-4 font-medium">{order.maHoaDon}</td>
                                    {/* Giả định order.khachHang có trường hoTen */}
                                    <td className="py-3 px-4">{order.khachHang?.hoTen || 'Khách lẻ'}</td>
                                    <td className="py-3 px-4">{order.thanhTien?.toLocaleString('vi-VN') + ' VNĐ'}</td>
                                    <td className="py-3 px-4">
                                        {/* Dùng StatusBadge với ENUM status */}
                                        <StatusBadge status={statusMap[order.trangThaiHoaDon]} />
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.ngayDat).toLocaleDateString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentOrders;