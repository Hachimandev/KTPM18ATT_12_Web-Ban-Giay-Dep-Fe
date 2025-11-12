import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function OrderSuccessPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="max-w-xl mx-auto p-8 my-20 bg-white rounded-xl shadow-2xl text-center border-t-4 border-green-500">

            <FiCheckCircle size={80} className="mx-auto text-green-500 mb-6" />

            <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
                Đặt hàng thành công!
            </h1>

            <p className="text-gray-600 mb-6">
                Cảm ơn bạn đã tin tưởng ShopGiay. Chúng tôi sẽ sớm xử lý đơn hàng của bạn.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg inline-block">
                <p className="font-semibold text-gray-700">
                    Mã đơn hàng:
                    <span className="text-orange-600 ml-2 select-all">
                        {orderId || 'Đang cập nhật...'}
                    </span>
                </p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
                <button
                    onClick={() => navigate('/account/orders')}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                    Xem Chi Tiết Đơn
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
}