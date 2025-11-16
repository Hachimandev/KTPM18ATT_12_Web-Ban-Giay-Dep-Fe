import { useEffect, useState } from 'react';
import { FiAward, FiTarget, FiUsers, FiHeart } from 'react-icons/fi';

const AboutPage = () => {
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with: const response = await fetch('/api/shop-info');
    const mockShopInfo = {
      id: 1,
      shopName: 'ShopGiay',
      description: 'Cửa hàng giày dép thời trang hàng đầu Việt Nam',
      address: '123 Đường ABC, Quận 1, TP HCM',
      phone: '0123.456.789',
      email: 'info@shopgiay.com',
      foundedYear: 2015,
      customerCount: 50000,
      aboutText: 'ShopGiay được thành lập vào năm 2015 với sứ mệnh mang đến những đôi giày chất lượng cao, phong cách và giá cả hợp lý cho khách hàng Việt Nam.',
      story: 'Từ một cửa hàng nhỏ tại Quận 1, TP HCM, chúng tôi đã phát triển thành một trong những cửa hàng giày dép uy tín nhất, với hàng chục ngàn khách hàng hài lòng.',
      mission: 'Hôm nay, ShopGiay tự hào là nơi tin cậy của bạn để tìm kiếm những đôi giày nam, nữ, dép và sandal với chất lượng tốt nhất.'
    };
    
    setShopInfo(mockShopInfo);
    setLoading(false);
  }, []);

  const features = [
    {
      icon: <FiAward size={32} />,
      title: 'Chất Lượng Hàng Đầu',
      description: 'Chúng tôi cam kết chỉ bán những sản phẩm giày dép chất lượng cao từ các thương hiệu uy tín'
    },
    {
      icon: <FiTarget size={32} />,
      title: 'Phục Vụ Tận Tâm',
      description: 'Đội ngũ nhân viên chuyên nghiệp, thân thiện sẵn sàng hỗ trợ bạn tìm kiếm sản phẩm phù hợp'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Cộng Đồng Khách Hàng',
      description: 'Hơn 50.000 khách hàng hài lòng tin tưởng ShopGiay hàng năm'
    },
    {
      icon: <FiHeart size={32} />,
      title: 'Đam Mê Thời Trang',
      description: 'Chúng tôi yêu thích giày dép và muốn chia sẻ niềm đam mê này với bạn'
    }
  ];

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Về {shopInfo?.shopName}</h1>
          <p className="text-xl opacity-90">{shopInfo?.description}</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Câu Chuyện Của {shopInfo?.shopName}</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {shopInfo?.aboutText}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {shopInfo?.story}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {shopInfo?.mission}
              </p>
            </div>
            <div className="bg-orange-100 rounded-lg p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-orange-500 mb-2">{shopInfo?.customerCount?.toLocaleString()}+</div>
                <p className="text-gray-600 text-lg">Khách hàng hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Tại Sao Chọn {shopInfo?.shopName}?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-orange-500 flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Hành Trình Của {shopInfo?.shopName}</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">{shopInfo?.foundedYear}</div>
                  <div className="w-1 h-16 bg-orange-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-gray-800">Thành Lập {shopInfo?.shopName}</h3>
                  <p className="text-gray-600 mt-2">Mở cửa hàng đầu tiên tại Quận 1, TP HCM với mục tiêu mang đến giày chất lượng cao cho khách hàng Việt.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2017</div>
                  <div className="w-1 h-16 bg-orange-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-gray-800">Mở Rộng Thương Hiệu</h3>
                  <p className="text-gray-600 mt-2">Phát triển dòng sản phẩm với nhiều thương hiệu nổi tiếng, mở thêm chi nhánh tại Hà Nội.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2020</div>
                  <div className="w-1 h-16 bg-orange-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-gray-800">Kỷ Niệm 5 Năm</h3>
                  <p className="text-gray-600 mt-2">Đạt mốc 50.000 khách hàng hài lòng, phát triển nền tảng bán hàng trực tuyến.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2025</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Tương Lai Sáng Sủa</h3>
                  <p className="text-gray-600 mt-2">Tiếp tục phát triển, mang đến cho bạn trải nghiệm mua sắm giày tốt nhất.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Tìm Đôi Giày Yêu Thích?</h2>
          <p className="text-xl opacity-90 mb-8">Khám phá bộ sưu tập giày mới nhất của chúng tôi</p>
          <a
            href="/products/giay-nam"
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Mua Sắm Ngay
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
