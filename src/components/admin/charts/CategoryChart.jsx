// src/components/admin/charts/CategoryChart.jsx
// @ts-nocheck
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Sửa component để nhận chartData qua props
const CategoryChart = ({ chartData }) => {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Số lượng đơn hàng',
                data: chartData.data,
                backgroundColor: [
                    '#F97316', // Orange
                    '#0F172A', // Black
                    '#3B82F6', // Blue
                    '#6B7280', // Gray
                ],
                borderColor: [
                    '#fff',
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Đơn hàng theo danh mục',
                align: 'start',
                font: {
                    size: 18,
                    weight: 'bold',
                },
                padding: {
                    bottom: 20,
                }
            },
        },
    };

    if (!chartData.labels || chartData.labels.length === 0) return <div className="text-center p-4">Không có dữ liệu danh mục.</div>;

    return (
        <div style={{ height: '350px' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default CategoryChart;