// /lib/axios.js
import axios from 'axios';

// 인스턴스 생성
const axiosInstance = axios.create({
  withCredentials: true, // refreshToken 쿠키 전달용
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 요청 인터셉터: accessToken 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = accessToken; // Bearer 포함된 상태로 저장돼야 함
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: accessToken 만료 시 refresh 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // refreshToken 쿠키 기반으로 accessToken 재발급 요청
        const res = await axios.post('/api/auth/refresh', null, {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;

        sessionStorage.setItem('accessToken', newAccessToken);
        axiosInstance.defaults.headers.Authorization = newAccessToken;

        processQueue(null, newAccessToken);

        // 재시도
        originalRequest.headers.Authorization = newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (refreshError.response?.status === 401) {
          window.location.href = '/signin'; // 인증 만료 시 로그인 페이지로 이동
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
