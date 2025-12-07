// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import OrderCard from "../components/common/OrderCard";

export default function OrderHistoryPage() {
    const { status: urlStatus } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(() => {
        setLoading(true);
        const username = localStorage.getItem("username");

        api.get(`/hoadon/history?username=${username}`)
            .then((data) => setOrders(data))
            .catch((err) => console.error("Lỗi tải đơn:", err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // ---------------------------
    // 🔹 Map tiêu đề hiển thị
    // ---------------------------
    const statusTitleMap = {
        PENDING: "Đơn hàng đang chờ",
        SHIPPING: "Đơn hàng đang giao",
        CANCELLED: "Đơn hàng đã hủy",
        DELIVERED: "Đơn hàng đã giao",
        ALL: "Lịch sử đơn hàng",
    };

    const title = statusTitleMap[urlStatus?.toUpperCase()] || "Lịch sử đơn hàng";

    // ---------------------------
    // 🔹 Map lọc đơn đúng chuẩn
    // ---------------------------
    const ordersToDisplay = useMemo(() => {
        if (!orders.length) return [];

        const map = {
            PENDING: ["CHO_XAC_NHAN"],
            SHIPPING: ["DANG_GIAO", "CHO_HUY"],
            CANCELLED: ["DA_HUY"],
            DELIVERED: ["DA_GIAO"],
            ALL: ["CHO_XAC_NHAN", "DANG_GIAO", "CHO_HUY", "DA_GIAO", "DA_HUY"],
        };

        const target = map[urlStatus?.toUpperCase()] || map.ALL;
        return orders.filter(o => target.includes(o.trangThaiHoaDon));
    }, [orders, urlStatus]);

    const handleCancel = async (maHoaDon) => {
        const username = localStorage.getItem("username");

        if (!window.confirm(`Bạn muốn hủy đơn ${maHoaDon}?`)) return;

        try {
            await api.post(`/hoadon/cancel/${maHoaDon}?username=${username}`);

            toast.success("Đã gửi yêu cầu hủy!", { duration: 3000 });
            fetchOrders();
        } catch (error) {
            toast.error("Không thể hủy đơn");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">

                {/* 🔥 Tiêu đề động */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {title}
                </h1>

                {loading ? (
                    <div className="text-center py-10">Đang tải...</div>
                ) : ordersToDisplay.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-600">Không có đơn nào.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ordersToDisplay.map((order) => (
                            <OrderCard
                                key={order.maHoaDon}
                                order={order}
                                onCancel={handleCancel}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
