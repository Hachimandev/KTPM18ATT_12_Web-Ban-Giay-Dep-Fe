// src/components/home/SpecialOffer.jsx
import { Link } from 'react-router-dom';

const SpecialOffer = () => {
    return (
        <section className="bg-[#FF6B35] text-white py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-4">Khuyến Mãi Đặc Biệt</h2>
                <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
                    Giảm giá lên đến 50% cho tất cả sản phẩm. Đừng bỏ lỡ!
                </p>
                <Link
                    to="/products/khuyen-mai"
                    className="bg-white text-orange-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                    Mua Ngay
                </Link>
            </div>
        </section>
    );
};

export default SpecialOffer;