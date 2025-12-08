import { useState, useEffect } from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiSend,
} from "react-icons/fi";

const ContactPage = () => {
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // TODO: Replace with: const response = await fetch('/api/shop-info');
    const mockShopInfo = {
      id: 1,
      shopName: "ShopGiay",
      address: "123 Đường ABC, Quận 1, TP HCM",
      phone: "0123.456.789",
      email: "info@shopgiay.com",
      openHours: "Thứ 2 - Thứ 7: 8:00 - 20:00",
      closedDay: "Chủ Nhật từ 9:00 - 19:00",
      facebookUrl: "https://facebook.com/shopgiay",
      instagramUrl: "https://instagram.com/shopgiay",
      youtubeUrl: "https://youtube.com/shopgiay",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4789305394266!2d106.67449!3d10.76962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f7c7c0001%3A0x123456789!2s123%20Street%2C%20District%201%2C%20Ho%20Chi%20Minh!5e0!3m2!1sen!2s!4v1234567890",
    };

    setShopInfo(mockShopInfo);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus({
        type: "success",
        message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.",
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Có lỗi xảy ra. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  const contactInfo = [
    {
      icon: <FiMapPin size={24} />,
      title: "Địa Chỉ",
      content: shopInfo?.address,
      color: "text-orange-500",
    },
    {
      icon: <FiPhone size={24} />,
      title: "Điện Thoại",
      content: shopInfo?.phone,
      color: "text-orange-500",
    },
    {
      icon: <FiMail size={24} />,
      title: "Email",
      content: shopInfo?.email,
      color: "text-orange-500",
    },
    {
      icon: <FiClock size={24} />,
      title: "Giờ Mở Cửa",
      content: shopInfo?.openHours,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl opacity-90">
            Chúng tôi rất vui khi nhận tin từ bạn
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className={`flex justify-center mb-4 ${info.color}`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600">{info.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>

              {submitStatus && (
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Của Bạn
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Nhập tên của bạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Nhập email của bạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Nhập số điện thoại (tùy chọn)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ Đề
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    placeholder="Nhập chủ đề"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tin Nhắn
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiSend size={18} />
                  {isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
                </button>
              </form>
            </div>

            {/* Map Section */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm h-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Vị Trí Của Chúng Tôi
                </h2>
                <div className="rounded-lg overflow-hidden h-96">
                  <iframe
                    src={shopInfo?.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ShopGiay Location"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Kết Nối Với Chúng Tôi
                </h3>
                <div className="flex gap-4">
                  <a
                    href={shopInfo?.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 text-2xl transition-colors"
                  >
                    <FiFacebook />
                  </a>
                  <a
                    href={shopInfo?.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 text-2xl transition-colors"
                  >
                    <FiInstagram />
                  </a>
                  <a
                    href={shopInfo?.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 text-2xl transition-colors"
                  >
                    <FiYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                Giờ mở cửa là mấy giờ?
              </h3>
              <p className="text-gray-600">
                Chúng tôi mở cửa từ thứ 2 đến thứ 7, từ 8:00 sáng đến 20:00 tối.
                Chủ nhật từ 9:00 sáng đến 19:00 tối.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                Bạn có cung cấp dịch vụ giao hàng không?
              </h3>
              <p className="text-gray-600">
                Có, chúng tôi cung cấp dịch vụ giao hàng tại TP HCM và các tỉnh
                lân cận với giá cạnh tranh.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                Chính sách đổi trả như thế nào?
              </h3>
              <p className="text-gray-600">
                Bạn có thể đổi hoặc trả lại sản phẩm trong vòng 7 ngày nếu sản
                phẩm bị lỗi hoặc không vừa vặn.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">
                Bạn chấp nhận những phương thức thanh toán nào?
              </h3>
              <p className="text-gray-600">
                Chúng tôi chấp nhận thanh toán tiền mặt, chuyển khoản ngân hàng,
                và các ứng dụng thanh toán di động.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
