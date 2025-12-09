-- SQL Migration Script: Cập nhật ngay_tham_gia cho các khách hàng hiện có

-- 1. Thêm cột ngay_tham_gia nếu chưa có
ALTER TABLE khach_hang ADD COLUMN ngay_tham_gia DATETIME DEFAULT CURRENT_TIMESTAMP;

-- 2. Cập nhật ngay_tham_gia = CURRENT_TIMESTAMP cho các bản ghi cũ (nếu ngay_tham_gia còn NULL)
UPDATE khach_hang 
SET ngay_tham_gia = CURRENT_TIMESTAMP 
WHERE ngay_tham_gia IS NULL;
