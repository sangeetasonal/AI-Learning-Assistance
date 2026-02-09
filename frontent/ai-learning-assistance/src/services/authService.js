// import axiosInstance from '../utils/axiosInstance';
// import { API_PATHS } from '../utils/apiPaths';

// const login = async (email, password) => {
//   try {
//     const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
//       email,
//       password,
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'An unknown error occurred' };
//   }
// };

// const register = async (username, email, password) => {
//   try {
//     const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
//       username,
//       email,
//       password,
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'An unknown error occurred' };
//   }
// };

// const getProfile = async () => {
//   try {
//     const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'An unknown error occurred' };
//   }
// };

// const updateProfile = async (userData) => {
//   try {
//     const response = await axiosInstance.put(
//       API_PATHS.AUTH.UPDATE_PROFILE,
//       userData
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'An unknown error occurred' };
//   }
// };

// const changePassword = async (passwords) => {
//   try {
//     const response = await axiosInstance.post(
//       API_PATHS.AUTH.CHANGE_PASSWORD,
//       passwords
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'An unknown error occurred' };
//   }
// };

// const authService = {
//   login,
//   register,
//   getProfile,
//   updateProfile,
//   changePassword,
// };

// export default authService;


import apiClient from "../utils/apiClient";
import { API_PATHS } from "../utils/apiPaths";

/**
 * LOGIN
 */
const login = (email, password) => {
  return apiClient(API_PATHS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

/**
 * REGISTER
 */
const register = (username, email, password) => {
  return apiClient(API_PATHS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
};

/**
 * GET PROFILE
 */
const getProfile = () => {
  return apiClient(API_PATHS.AUTH.GET_PROFILE);
};

/**
 * UPDATE PROFILE
 */
const updateProfile = (userData) => {
  return apiClient(API_PATHS.AUTH.UPDATE_PROFILE, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

/**
 * CHANGE PASSWORD
 */
const changePassword = (passwords) => {
  return apiClient(API_PATHS.AUTH.CHANGE_PASSWORD, {
    method: "POST",
    body: JSON.stringify(passwords),
  });
};

export default {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
};
