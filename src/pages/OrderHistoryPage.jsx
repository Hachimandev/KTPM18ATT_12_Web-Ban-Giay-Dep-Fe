// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import { FiClock, FiCheckCircle, FiTruck, FiXCircle, FiList } from 'react-icons/fi';
import productImageMap from '../constants/productImages';

const statusMap = {
    'CHO_XAC_NHAN': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <FiClock size={16} /> },
    'DANG_GIAO': { label: 'Đang giao hàng', color: 'bg-blue-100 text-blue-800', icon: <FiTruck size={16} /> },
    'DA_GIAO': { label: 'Đã giao (Hoàn tất)', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle size={16} /> },
    'DA_HUY': { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <FiXCircle size={16} /> },
};

const getStatusDetails = (status) => statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: <FiList size={16} /> };

const OrderCard = ({ order }) => {
    const navigate = useNavigate();
    const firstItem = order.chiTietHoaDons && order.chiTietHoaDons.length > 0 ? order.chiTietHoaDons[0] : null;
    const statusDetails = getStatusDetails(order.trangThaiHoaDon);
    const totalItems = order.chiTietHoaDons ? order.chiTietHoaDons.reduce((sum, item) => sum + item.soLuong, 0) : 0;
    const additionalItemsCount = order.chiTietHoaDons.length - 1;

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex justify-between items-start border-b pb-3 mb-3">
                <div className="text-sm text-gray-600">
                    Mã HĐ: <span className="font-semibold text-gray-800">{order.maHoaDon}</span>
                    <p>Ngày đặt: {new Date(order.ngayDat).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusDetails.color}`}>
                    {statusDetails.icon}
                    <span className="ml-1">{statusDetails.label}</span>
                </div>
            </div>

            {/* Chi tiết sản phẩm */}
            <div className="flex items-center space-x-4">
                {firstItem && (
                    <>
                        <img
                            src={productImageMap[firstItem.sanPham.hinhAnh] || `https://placehold.co/60x60?text=${firstItem.sanPham?.tenSanPham.substring(0, 3) || 'SP'}`}
                            alt={firstItem.sanPham?.tenSanPham}
                            className="w-16 h-16 rounded-md object-cover"
                        />
                        <div>
                            <p className="font-medium text-gray-800">
                                {firstItem.sanPham?.tenSanPham}
                                {additionalItemsCount > 0 && <span className='ml-2 text-sm text-gray-500'> (+{additionalItemsCount} sản phẩm khác)</span>}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                Size: {firstItem.chiTietSanPham?.size} | Màu:
                                <span
                                    className="inline-block w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: firstItem.chiTietSanPham?.mau }}
                                ></span>
                            </p>
                        </div>
                    </>
                )}

                <div className="ml-auto text-right">
                    <p className="text-xl font-bold text-orange-600">{order.thanhTien.toLocaleString()} VNĐ</p>
                    <p className="text-xs text-gray-500 mt-1">Tổng cộng {totalItems} món hàng</p>
                    <button
                        className="text-sm text-blue-600 hover:underline mt-1"
                        onClick={() => navigate(`/account/order/${order.maHoaDon}`)}
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function OrderHistoryPage() {
    const { status: urlStatus } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const enumStatus = useMemo(() => {
        if (!urlStatus || urlStatus === 'all') return 'DA_GIAO';
        switch (urlStatus.toUpperCase()) {
            case 'PENDING': return 'CHO_XAC_NHAN';
            case 'SHIPPING': return 'DANG_GIAO';
            case 'COMPLETED': return 'DA_GIAO';
            case 'CANCELLED': return 'DA_HUY';
            default: return null;
        }
    }, [urlStatus]);


    useEffect(() => {
        setLoading(true);

        const username = localStorage.getItem("username");
        const params = new URLSearchParams();
        if (enumStatus) params.append("status", enumStatus);
        if (username) params.append("username", username);

        api.get(`/hoadon/history?${params.toString()}`)
            .then(data => {
                setOrders(data);
            })
            .catch(err => console.error("Lỗi tải lịch sử đơn hàng:", err))
            .finally(() => setLoading(false));
    }, [enumStatus]);


    const currentStatusLabel = getStatusDetails(enumStatus)?.label;
    const pageTitle = urlStatus === 'all' || enumStatus === null
        ? 'Toàn bộ Lịch sử đơn hàng'
        : `Đơn hàng: ${currentStatusLabel}`;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{pageTitle}</h1>

                {loading ? (
                    <div className="text-center py-10">Đang tải đơn hàng...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-600">Không tìm thấy đơn hàng nào trong mục này.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <OrderCard key={order.maHoaDon} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}