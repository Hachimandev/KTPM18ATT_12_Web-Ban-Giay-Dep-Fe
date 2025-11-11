// src/components/home/CategorySection.jsx
import { Link } from 'react-router-dom';
import depSandalImg from '../../assets/image/dep-sandal.png';
import giayNamImg from '../../assets/image/giaynam.png';
import giayNuImg from '../../assets/image/giaynu.png';

const categories = [
    {
        name: 'Giày Nam',
        desc: 'Bộ sưu tập giày nam thời trang',
        img: giayNamImg,
        href: '/products/giay-nam'
    },
    {
        name: 'Giày Nữ',
        desc: 'Giày nữ cao cấp, phong cách',
        img: giayNuImg,
        href: '/products/giay-nu'
    },
    {
        name: 'Dép & Sandal',
        desc: 'Dép thời trang, thoải mái',
        img: depSandalImg,
        href: '/products/dep'
    },
];

const CategorySection = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Danh Mục Sản Phẩm
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <div key={category.name} className="bg-white rounded-lg shadow-md overflow-hidden text-center group">
                            <Link to={category.href}>
                                <img
                                    src={category.img}
                                    alt={category.name}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                                <p className="text-gray-600 mb-4">{category.desc}</p>
                                <Link
                                    to={category.href}
                                    className="inline-block bg-brand-orange text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors"
                                >
                                    Xem Ngay
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;