import React from "react";

// Dữ liệu mock gợi ý
const MOCK_PROVINCES = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];
const MOCK_DISTRICTS = {
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Tân Bình"],
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê"],
};
const MOCK_WARDS = {
  "Quận 1": ["Bến Nghé", "Bến Thành"],
  "Quận 3": ["Võ Thị Sáu", "Phường 6"],
  "Tân Bình": ["Phường 1", "Phường 2"],
  "Ba Đình": ["Phúc Xá", "Trúc Bạch"],
  "Hoàn Kiếm": ["Hàng Bạc", "Hàng Buồm"],
  "Hải Châu": ["Thạch Thang", "Hải Châu 1"],
  "Thanh Khê": ["Xuân Hà", "Thanh Khê Đông"],
};

export default function ShippingForm({ formData, onChange }) {
  // Hàm gộp giá trị MOCK + backend value
  const mergeOptions = (mock, value) =>
    [...mock, value].filter((v, i, a) => v && a.indexOf(v) === i);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">
        Thông tin giao hàng
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          name="hoTen"
          placeholder="Họ và tên *"
          value={formData.hoTen}
          onChange={onChange}
          required
          className="p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
        />
        <input
          type="tel"
          name="sdt"
          placeholder="Số điện thoại *"
          value={formData.sdt}
          onChange={onChange}
          required
          className="p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={onChange}
          required
          className="p-3 border rounded-lg md:col-span-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <input
          type="text"
          name="diaChiChiTiet"
          placeholder="Số nhà, tên đường *"
          value={formData.diaChiChiTiet}
          onChange={onChange}
          required
          className="p-3 border rounded-lg md:col-span-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Tỉnh/Thành */}
        <input
          list="provinces"
          name="tinhThanh"
          value={formData.tinhThanh}
          onChange={onChange}
          required
          className="p-3 border rounded-lg"
          placeholder="Chọn hoặc nhập tỉnh/thành *"
        />
        <datalist id="provinces">
          {mergeOptions(MOCK_PROVINCES, formData.tinhThanh).map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>

        {/* Quận/Huyện */}
        <input
          list="districts"
          name="quanHuyen"
          value={formData.quanHuyen}
          onChange={onChange}
          required
          className="p-3 border rounded-lg"
          placeholder="Chọn hoặc nhập quận/huyện *"
        />
        <datalist id="districts">
          {mergeOptions(
            MOCK_DISTRICTS[formData.tinhThanh] || [],
            formData.quanHuyen
          ).map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>

        {/* Phường/Xã */}
        <input
          list="wards"
          name="phuongXa"
          value={formData.phuongXa}
          onChange={onChange}
          required
          className="p-3 border rounded-lg"
          placeholder="Chọn hoặc nhập phường/xã *"
        />
        <datalist id="wards">
          {mergeOptions(
            MOCK_WARDS[formData.quanHuyen] || [],
            formData.phuongXa
          ).map((w) => (
            <option key={w} value={w} />
          ))}
        </datalist>
      </div>

      <label className="flex items-center text-sm text-gray-600 mt-2">
        <input
          type="checkbox"
          name="saveInfo"
          checked={formData.saveInfo}
          onChange={onChange}
          className="rounded text-orange-500 mr-2"
        />
        Lưu thông tin này cho lần mua hàng tiếp theo
      </label>
    </div>
  );
}
