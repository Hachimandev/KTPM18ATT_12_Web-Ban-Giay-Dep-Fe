import React from "react";

const MOCK_PROVINCES = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];
const MOCK_DISTRICTS = { "Hồ Chí Minh": ["Quận 1", "Quận 3", "Tân Bình"] };

export default function ShippingForm({ formData, onChange }) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Thông tin giao hàng</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <input type="text" name="hoTen" placeholder="Họ và tên *" value={formData.hoTen} onChange={onChange} required className="p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500" />
                <input type="tel" name="sdt" placeholder="Số điện thoại *" value={formData.sdt} onChange={onChange} required className="p-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500" />
                <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={onChange} required className="p-3 border rounded-lg md:col-span-2 focus:ring-orange-500 focus:border-orange-500" />
                <input type="text" name="diaChi" placeholder="Nhập địa chỉ chi tiết *" value={formData.diaChi} onChange={onChange} required className="p-3 border rounded-lg md:col-span-2 focus:ring-orange-500 focus:border-orange-500" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <select name="tinhThanh" value={formData.tinhThanh} onChange={onChange} required className="p-3 border rounded-lg">
                    <option value="">Chọn tỉnh/thành *</option>
                    {MOCK_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>

                <select name="quanHuyen" value={formData.quanHuyen} onChange={onChange} required className="p-3 border rounded-lg">
                    <option value="">Chọn quận/huyện *</option>
                    {formData.tinhThanh && MOCK_DISTRICTS[formData.tinhThanh]?.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>

                <select name="phuongXa" value={formData.phuongXa} onChange={onChange} required className="p-3 border rounded-lg">
                    <option value="">Chọn phường/xã *</option>
                </select>
            </div>

            <label className="flex items-center text-sm text-gray-600 mt-2">
                <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={onChange} className="rounded text-orange-500 mr-2" />
                Lưu thông tin này cho lần mua hàng tiếp theo
            </label>
        </div>
    );
}
