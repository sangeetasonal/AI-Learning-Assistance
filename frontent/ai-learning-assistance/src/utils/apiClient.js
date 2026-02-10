import { BASE_URL } from "./apiPaths";

const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // Auto-handle JSON bodies
  if (config.body && !(config.body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw data || { message: "Something went wrong" };
    }

    return data;
  } catch (error) {
    throw error?.message ? error : { message: "Network error" };
  }
};

export default apiClient;
