const BASE_URL = "http://localhost:8000";

const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw errorData || { message: "Something went wrong" };
    }

    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw { message: "Request timeout" };
    }
    throw error;
  }
};

export default apiClient;
