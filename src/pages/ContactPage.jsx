import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Đang gửi...");

    try {
      const response = await fetch("http://localhost:8085/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Có lỗi xảy ra khi gửi. Vui lòng thử lại sau.");
      }
    } catch (error) {
      setStatus("Không thể kết nối đến máy chủ.");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-3">
            Liên hệ với ShopGiay
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hãy để lại lời nhắn hoặc liên hệ với chúng tôi nếu bạn có bất kỳ câu
            hỏi nào về sản phẩm hoặc đơn hàng.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Thông tin liên hệ
            </h2>
            <ul className="space-y-5 text-gray-700">
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-500 rounded-full">
                  <FiMapPin size={22} />
                </div>
                <div>
                  <p className="font-semibold">Địa chỉ</p>
                  <p>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-500 rounded-full">
                  <FiPhone size={22} />
                </div>
                <div>
                  <p className="font-semibold">Hotline</p>
                  <p>0123 456 789</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-500 rounded-full">
                  <FiMail size={22} />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p>info@shopgiay.com</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 text-orange-500 rounded-full">
                  <FiClock size={22} />
                </div>
                <div>
                  <p className="font-semibold">Giờ làm việc</p>
                  <p>Thứ 2 - CN: 8:00 - 21:00</p>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <iframe
                title="ShopGiay Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.480676489339!2d106.70042331526086!3d10.775843392322116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3baf1b9f1d%3A0xdbece4cdbf18136a!2zQ8O0bmcgVHkgVGjhu6d5IEdpw6B5IMSQ4buTbmc!5e0!3m2!1svi!2s!4v1693389000000!5m2!1svi!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-xl"
              ></iframe>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="Nhập họ tên của bạn"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Nội dung</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  placeholder="Nhập nội dung tin nhắn..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Gửi tin nhắn
              </button>
            </form>

            {status && (
              <p className="mt-4 text-center text-sm text-gray-600">{status}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
