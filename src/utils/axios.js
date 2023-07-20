import axios from 'axios';
import { getToken, removeUserSession } from './common';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Xử lý khi token không hợp lệ hoặc hết hạn
        removeUserSession(); // Xóa token từ local storage hoặc nơi lưu trữ tương tự
        // Thực hiện các xử lý khác nếu cần thiết, ví dụ như chuyển hướng đến trang đăng nhập
      }
    }
    return Promise.reject(error);
  }
);

export const getAPI = async (url, option) => {
  const response = await axiosInstance.get(url, option);
  return response;
};

export const postAPI = async (url, option) => {
  const response = await axiosInstance.post(url, option);
  return response;
};

export const putAPI = async (url, option) => {
  const response = await axiosInstance.put(url, option);
  return response;
};

export const deleteAPI = async (url, option) => {
  const response = await axiosInstance.delete(url, option);
  return response;
};
