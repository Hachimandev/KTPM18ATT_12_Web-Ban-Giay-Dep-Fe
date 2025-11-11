/**
 * @typedef {object} ChiTietSanPham
 * @property {string} maChiTiet
 * @property {string} mau
 * @property {number} size
 * @property {number} soLuongTonKho
 */

/**
 * @typedef {object} LoaiSanPham
 * @property {string} maLoai
 * @property {string} tenLoai
 */

/**
 * @typedef {object} NhaCungCap
 * @property {string} maNhaCungCap
 * @property {string} tenNhaCungCap
 */

/**
 * @typedef {object} SanPham
 * @property {string} maSanPham
 * @property {string} tenSanPham
 * @property {string} nuocSanXuat
 * @property {string} moTa
 * @property {string} chatLieu
 * @property {string} thuongHieu
 * @property {number} thue
 * @property {number} giaBan
 * @property {string} hinhAnh
 * * @property {NhaCungCap} nhaCungCap
 * @property {LoaiSanPham} loaiSanPham
 * * @property {ChiTietSanPham[]} chiTietSanPhams
 */

export default {};
