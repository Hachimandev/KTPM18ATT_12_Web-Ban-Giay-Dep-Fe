// @ts-nocheck
const StatusBadge = ({ status }) => {
    let colorClasses = '';

    switch (status) {
        case "Chờ xác nhận":
            colorClasses = 'bg-yellow-100 text-yellow-700';
            break;
        case "Đang giao":
            colorClasses = 'bg-yellow-200 text-yellow-800';
            break;
        case "Đã giao":
            colorClasses = 'bg-green-100 text-green-700';
            break;
        case "Đã hủy":
        case "Trả hàng":
            colorClasses = 'bg-red-100 text-red-700';
            break;
        default:
            colorClasses = 'bg-gray-100 text-gray-700';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
