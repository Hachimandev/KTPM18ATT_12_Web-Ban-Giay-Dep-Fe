// src/components/home/ProductList.jsx
import ProductCard from '../common/ProductCard.jsx'; // <-- Nhớ .jsx

const ProductList = ({ title, products, cardType }) => {
    if (!products || products.length === 0) {
        return null;
    }

    const gridCols = `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">
                    {title}
                </h2>
                <div className={`grid ${gridCols} gap-8`}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id || product.maSanPham}
                            product={product}
                            type={cardType}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductList;