import { Link } from 'react-router-dom';
import heroImageUrl from '../../assets/image/shoes-on-shelf.png';

const HeroSection = () => {
    return (

        <section className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white">
            <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
                <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Bộ Sưu Tập Giày Mới 2024
                    </h1>
                    <p className="text-lg text-gray-300 mb-8">
                        Khám phá những mẫu giày thời trang mới nhất với chất lượng cao và giá cả hợp lý
                    </p>
                    <div className="flex space-x-4">
                        <Link
                            to="/khuyen-mai"
                            className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:scale-105 transition-all duration-300"
                        >
                            Mua Ngay
                        </Link>

                        <Link
                            to="/giay-nam"
                            className="border border-gray-400 text-white px-6 py-3 rounded-md font-semibold hover:border-brand-orange hover:text-brand-orange hover:scale-105 transition-all duration-300"
                        >
                            Xem Thêm
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <img
                        src={heroImageUrl}
                        alt="Bộ sưu tập giày mới"
                        className="rounded-lg shadow-xl w-full max-w-md"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;