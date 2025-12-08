import React, { useState, useEffect } from 'react';
import { FiStar, FiSend, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import * as api from '../../api/api';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // Để lấy username

// --- Sub-component: Hiển thị 5 sao ---
const StarRating = ({ rating }) => {
    return (
        <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
                <FiStar
                    key={i}
                    size={16}
                    className={i < rating ? 'fill-yellow-500' : 'fill-none stroke-yellow-500'}
                />
            ))}
        </div>
    );
};

// --- Component Chính: Danh sách và Form Bình luận ---
const ProductReviews = ({ maSanPham }) => {
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5); // Mặc định 5 sao
    const [loading, setLoading] = useState(true);
    const { username } = useCart(); // Lấy username từ Context

    // --- API Fetching ---
    const fetchReviews = async () => {
        setLoading(true);
        try {
            // 💡 API ĐỀ XUẤT: GET /api/binhluan/by-product/{maSanPham}
            const res = await api.get(`/binhluan/by-product/${maSanPham}`);
            setReviews(res || []);
        } catch (err) {
            console.error("Lỗi tải bình luận:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [maSanPham]);

    // --- Handler Gửi Bình luận ---
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!username) {
            toast.error('Vui lòng đăng nhập để bình luận.');
            return;
        }
        if (!newComment.trim()) {
            toast.error('Nội dung bình luận không được để trống.');
            return;
        }

        const payload = {
            maSanPham: maSanPham,
            username: username,
            noiDung: newComment,
            diemDanhGia: newRating,
        };

        try {
            // 💡 API ĐỀ XUẤT: POST /api/binhluan
            await api.post('/binhluan', payload);

            toast.success('Gửi bình luận thành công!');
            setNewComment('');
            setNewRating(5);
            fetchReviews(); // Tải lại danh sách
        } catch (err) {
            console.error('Lỗi gửi bình luận:', err);
            toast.error('Gửi bình luận thất bại. Vui lòng thử lại.');
        }
    };


    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">
                Đánh giá & Bình luận ({reviews.length})
            </h2>

            {/* Form Gửi Bình luận */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8 border">
                <h3 className="font-semibold text-lg mb-3">Gửi bình luận của bạn</h3>
                {username ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Rating Input */}
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Đánh giá:</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                        key={star}
                                        size={24}
                                        onClick={() => setNewRating(star)}
                                        className={`cursor-pointer transition-colors ${star <= newRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Comment Textarea */}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết đánh giá của bạn ở đây..."
                            rows={4}
                            className="w-full p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                            required
                        />

                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                        >
                            <FiSend size={18} /> Gửi Bình luận
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-600">Vui lòng <Link to="/login" className="text-blue-600 hover:underline">đăng nhập</Link> để gửi bình luận và đánh giá sản phẩm.</p>
                )}
            </div>

            {/* Danh sách Bình luận */}
            {loading ? (
                <p className="text-gray-500">Đang tải bình luận...</p>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500">Chưa có bình luận nào cho sản phẩm này.</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gray-200 rounded-full">
                                    <FiUser size={16} className="text-gray-600" />
                                </div>
                                <span className="font-semibold text-gray-800">
                                    {review.khachHang?.hoTen || 'Khách hàng'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    - {new Date(review.ngayTao).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <StarRating rating={review.diemDanhGia} />
                            <p className="mt-2 text-gray-700">{review.noiDung}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;