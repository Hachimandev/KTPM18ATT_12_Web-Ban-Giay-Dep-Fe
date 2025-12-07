// src/pages/admin/DashboardPage.jsx
import { useEffect, useState } from 'react';
import * as api from '../../api/api';
import {
    FiDollarSign, FiShoppingCart, FiPackage, FiUsers
} from 'react-icons/fi';
import StatCard from '../../components/admin/StatCard';
import SalesChart from '../../components/admin/charts/SalesChart';
import CategoryChart from '../../components/admin/charts/CategoryChart';
import RecentOrders from '../../components/admin/RecentOrders';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0, totalOrders: 0, totalStock: 0, totalCustomers: 0
    });
    const [salesData, setSalesData] = useState({ labels: [], data: [] });
    const [categoryData, setCategoryData] = useState({ labels: [], data: [] });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGlobalStats = async () => {
        try {
            const res = await api.get('/stats/global');
            setStats({
                totalRevenue: res.totalRevenue || 0,
                totalOrders: res.totalOrders || 0,
                totalStock: res.totalStock || 0,
                totalCustomers: res.totalCustomers || 0,
            });
        } catch (err) {
            console.error("Lỗi tải thống kê chung:", err);
            setError("Không thể tải các chỉ số tổng quan.");
        }
    };

    const fetchSalesData = async () => {
        try {
            const res = await api.get('/stats/sales-monthly');
            setSalesData({
                labels: res.labels || [],
                data: res.data || [],
            });
        } catch (err) {
            console.error("Lỗi tải dữ liệu biểu đồ doanh thu:", err);
        }
    };

    const fetchCategoryData = async () => {
        try {
            const res = await api.get('/stats/orders-by-category');
            setCategoryData({
                labels: res.labels || [],
                data: res.data || [],
            });
        } catch (err) {
            console.error("Lỗi tải dữ liệu biểu đồ danh mục:", err);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const res = await api.get('/hoadon/recent?limit=5');
            setRecentOrders(res || []);
        } catch (err) {
            console.error("Lỗi tải đơn hàng gần đây:", err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([
                fetchGlobalStats(),
                fetchSalesData(),
                fetchCategoryData(),
                fetchRecentOrders()
            ]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-xl text-gray-500">Đang tải dữ liệu Dashboard...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-xl text-red-500">{error}</div>;
    }


    return (
        <div className="space-y-8">
            {/* --- 1. Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng doanh thu"
                    value={stats.totalRevenue.toLocaleString('vi-VN') + " VNĐ"}
                    change="Đang tính..."
                    changeType="positive"
                    icon={<FiDollarSign />}
                    iconBgColor="bg-green-500"
                />
                <StatCard
                    title="Tổng đơn hàng"
                    value={stats.totalOrders.toLocaleString('vi-VN')}
                    change="Đang tính..."
                    changeType="positive"
                    icon={<FiShoppingCart />}
                    iconBgColor="bg-blue-500"
                />
                <StatCard
                    title="Tổng tồn kho"
                    value={stats.totalStock.toLocaleString('vi-VN')}
                    change="Đang tính..."
                    changeType="negative"
                    icon={<FiPackage />}
                    iconBgColor="bg-yellow-500"
                />
                <StatCard
                    title="Tổng Khách hàng"
                    value={stats.totalCustomers.toLocaleString('vi-VN')}
                    change="Đang tính..."
                    changeType="positive"
                    icon={<FiUsers />}
                    iconBgColor="bg-orange-500"
                />
            </div>

            {/* --- 2. Charts --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <SalesChart chartData={salesData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <CategoryChart chartData={categoryData} />
                </div>
            </div>

            {/* --- 3. Recent Orders --- */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <RecentOrders orders={recentOrders} />
            </div>
        </div>
    );
};

export default DashboardPage;