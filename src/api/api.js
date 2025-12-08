const API_BASE_URL = "/api";

// 💡 CẬP NHẬT: Thêm tham số isFileDownload để xử lý Blob
async function handleResponse(response, isFileDownload = false) {
  if (!response.ok) {
    // Đọc response dưới dạng text (thường là JSON lỗi hoặc chuỗi lỗi)
    const errorText = await response.text();
    console.error("Lỗi API:", errorText);
    throw new Error(errorText || "Đã xảy ra lỗi không xác định");
  }

  if (response.status === 204) {
    return null;
  }

  // 💡 LOGIC MỚI: Nếu là tải file, trả về Blob
  if (isFileDownload) {
    return response.blob();
  }

  // Mặc định: Trả về JSON (Dùng cho mọi GET, POST, PUT, DELETE thông thường)
  return response.json();
}

/**
 * Hàm GET chung
 * @param {string} endpoint Ví dụ: "/products", "/products/123"
 * @param {object} options Tùy chọn (ví dụ: { isFileDownload: true })
 */
export const get = (endpoint, options = {}) => {
  const fetchOptions = { method: "GET", ...options };
  // Truyền cờ isFileDownload từ options vào handleResponse
  const isFileDownload = options.isFileDownload || false;

  return fetch(`${API_BASE_URL}${endpoint}`, fetchOptions).then((response) =>
    handleResponse(response, isFileDownload)
  );
};

/**
 * Hàm POST chung
 * @param {string} endpoint Ví dụ: "/products"
 * @param {object} data Dữ liệu (object) cần gửi đi
 */
export const post = (endpoint, data) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => handleResponse(response, false)); // Luôn là false cho POST
};

/**
 * Hàm PUT chung
 * @param {string} endpoint Ví dụ: "/products/123"
 * @param {object} data Dữ liệu (object) cần cập nhật
 */
export const put = (endpoint, data) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => handleResponse(response, false));
};

/**
 * Hàm DELETE chung
 * @param {string} endpoint Ví dụ: "/products/123"
 */
export const remove = (endpoint) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
  }).then((response) => handleResponse(response, false));
};
