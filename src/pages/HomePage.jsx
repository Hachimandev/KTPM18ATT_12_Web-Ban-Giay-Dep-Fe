import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection.jsx";
import CategorySection from "../components/home/CategorySection.jsx";
import ProductList from "../components/home/ProductList.jsx";
import SpecialOffer from "../components/home/SpecialOffer.jsx";
import Newsletter from "../components/home/Newsletter.jsx";

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:8085/api/products");
                if (!res.ok) throw new Error("Không thể tải sản phẩm");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Lỗi khi gọi API:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500 text-lg">
                Đang tải sản phẩm...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500 text-lg">
                Lỗi: {error}
            </div>
        );
    }

    const featuredProducts = products.slice(0, 4);
    const bestSellingProducts = [...products]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

    return (
        <>
            <HeroSection />
            <CategorySection />

            <ProductList
                title="Sản Phẩm Nổi Bật"
                products={featuredProducts}
                cardType="button"
            />

            <SpecialOffer />

            <ProductList
                title="Sản Phẩm Bán Chạy"
                products={bestSellingProducts}
                cardType="rating"
            />

            <Newsletter />
        </>
    );
};

export default HomePage;
