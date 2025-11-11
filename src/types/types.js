/**
 * @typedef {object} ChiTietSanPham
 * @property {string} maChiTiet
 * @property {string} mau - Mã màu Hex (ví dụ: #FFFFFF)
 * @property {number} size - Kích thước giày (ví dụ: 39)
 * @property {number} soLuongTonKho
 * * // Quan hệ ngược (sanPham) bị JsonIgnore
 */

/**
 * @typedef {object} LoaiSanPham
 * @property {string} maLoai
 * @property {string} tenLoai
 * * // Quan hệ ngược (sanPhams) bị JsonIgnore
 */

/**
 * @typedef {object} NhaCungCap
 * @property {string} maNhaCungCap
 * @property {string} tenNhaCungCap
 * // ... (các thuộc tính khác giữ nguyên)
 */

/**
 * @typedef {object} SanPham
 * @property {string} maSanPham - Mã sản phẩm (ví dụ: SP001)
 * @property {string} tenSanPham - Tên sản phẩm
 * @property {string} nuocSanXuat
 * @property {string} moTa
 * @property {string} chatLieu
 * @property {string} thuongHieu
 * @property {number} thue - Tỷ lệ thuế hoặc chiết khấu (0.0 đến 1.0)
 * @property {number} giaBan
 * @property {string} hinhAnh - Tên file ảnh (ví dụ: giay-sneaker-trang.png)
 * * @property {NhaCungCap} nhaCungCap - Nhà cung cấp chính (ManyToOne)
 * @property {LoaiSanPham} loaiSanPham - Loại sản phẩm (ManyToOne)
 * * @property {ChiTietSanPham[]} chiTietSanPhams - Danh sách các biến thể (size, màu)
 * * // Quan hệ ManyToMany (nhaCungCaps) bị JsonIgnore
 */

// Export rỗng để file này được load
export default {};
