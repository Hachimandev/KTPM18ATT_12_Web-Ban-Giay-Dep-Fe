// @ts-nocheck
import { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiMail, FiEdit2, FiSave, FiX, FiLoader } from 'react-icons/fi';

const ShopInformationManaging = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // TODO: Replace with: const response = await fetch('/api/shop-info');
    const mockShopInfo = {
      id: 1,
      shopName: 'ShopGiay',
      address: '123 Đường ABC, Quận 1, TP HCM',
      phone: '0123.456.789',
      email: 'info@shopgiay.com',
      openHours: 'Thứ 2 - Thứ 7: 8:00 - 20:00',
      closedDay: 'Chủ Nhật từ 9:00 - 19:00',
      description: 'Cửa hàng giày dép thời trang hàng đầu Việt Nam',
      facebookUrl: 'https://facebook.com/shopgiay',
      instagramUrl: 'https://instagram.com/shopgiay',
      youtubeUrl: 'https://youtube.com/shopgiay',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4789305394266!2d106.67449!3d10.76962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f7c7c0001%3A0x123456789!2s123%20Street%2C%20District%201%2C%20Ho%20Chi%20Minh!5e0!3m2!1sen!2s!4v1234567890'
    };
    
    setFormData(mockShopInfo);
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(formData);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // TODO: Replace with: const response = await fetch('/api/shop-info', { method: 'PUT', body: JSON.stringify(editData) });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormData(editData);
      setIsEditing(false);
      alert('Thông tin cửa hàng đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating shop info:', error);
      alert('Lỗi khi cập nhật thông tin!');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Thông Tin Cửa Hàng</h1>
          <p className="text-gray-500 mt-1">Cập nhật thông tin và vị trí cửa hàng ShopGiay</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            <FiEdit2 size={18} /> Chỉnh Sửa
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Shop Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Cơ Bản</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Cửa Hàng</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="shopName"
                    value={editData.shopName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <p className="text-gray-600 py-2">{formData.shopName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô Tả</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                  />
                ) : (
                  <p className="text-gray-600 py-2">{formData.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-orange-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 py-2">{formData.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Liên Hệ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-orange-500 flex-shrink-0" />
                    <p className="text-gray-600 py-2">{formData.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <FiMail className="text-orange-500 flex-shrink-0" />
                    <p className="text-gray-600 py-2">{formData.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Giờ Mở Cửa</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Thường</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="openHours"
                    value={editData.openHours}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <p className="text-gray-600 py-2">{formData.openHours}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ Nhật</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="closedDay"
                    value={editData.closedDay}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <p className="text-gray-600 py-2">{formData.closedDay}</p>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mạng Xã Hội</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="facebookUrl"
                    value={editData.facebookUrl}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <a href={formData.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline py-2">{formData.facebookUrl}</a>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="instagramUrl"
                    value={editData.instagramUrl}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <a href={formData.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline py-2">{formData.instagramUrl}</a>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={editData.youtubeUrl}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                ) : (
                  <a href={formData.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline py-2">{formData.youtubeUrl}</a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Google Map */}
        <div className="space-y-6">
          {/* Map Embed URL */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Google Maps Embed</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Embed URL</label>
              {isEditing ? (
                <textarea
                  name="mapEmbedUrl"
                  value={editData.mapEmbedUrl}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none font-mono"
                  placeholder="Paste Google Maps embed URL here..."
                />
              ) : (
                <p className="text-gray-500 text-sm p-2 bg-gray-50 rounded break-all">{formData.mapEmbedUrl}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Lấy embed URL từ Google Maps bằng cách chọn "Share" → "Embed a map"</p>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 p-8 pb-4">Vị Trí Cửa Hàng</h2>
            <div className="h-96 overflow-hidden">
              <iframe
                src={formData.mapEmbedUrl}
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

          {/* Action Buttons */}
          {isEditing && (
            <div className="bg-white p-8 rounded-lg shadow-sm flex gap-4">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors ${
                  saveLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saveLoading ? (
                  <>
                    <FiLoader size={18} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    Lưu Thay Đổi
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={saveLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                <FiX size={18} />
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopInformationManaging;
