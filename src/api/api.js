const API_BASE_URL = "/api";

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Lỗi API:", errorText);
    throw new Error(errorText || "Đã xảy ra lỗi không xác định");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Hàm GET chung
 * @param {string} endpoint Ví dụ: "/products", "/products/123"
 */
export const get = (endpoint) => {
  return fetch(`${API_BASE_URL}${endpoint}`).then(handleResponse);
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
  }).then(handleResponse);
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
  }).then(handleResponse);
};

/**
 * Hàm DELETE chung
 * @param {string} endpoint Ví dụ: "/products/123"
 */
export const remove = (endpoint) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
  }).then(handleResponse);
};
