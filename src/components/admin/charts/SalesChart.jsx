// src/components/admin/charts/SalesChart.jsx
// @ts-nocheck
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Sửa component để nhận chartData qua props
const SalesChart = ({ chartData }) => {
    // Sử dụng data từ props thay vì hardcode
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: chartData.data,
                borderColor: '#F97316',
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                fill: false,
                tension: 0.3,
                pointBackgroundColor: '#F97316',
                pointBorderColor: '#fff',
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
            },
            title: {
                display: true,
                text: 'Doanh thu theo tháng',
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
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Doanh thu (VNĐ)',
                },
                // Thêm callback để định dạng tiền tệ trên trục Y
                ticks: {
                    callback: function (value, index, values) {
                        return (value / 1000000).toLocaleString('vi-VN') + ' tr';
                    }
                }
            },
        },
    };

    if (!chartData.labels || chartData.labels.length === 0) return <div className="text-center p-4">Không có dữ liệu doanh thu.</div>;

    return (
        <div style={{ height: '350px' }}>
            <Line options={options} data={data} />
        </div>
    );
};

export default SalesChart;