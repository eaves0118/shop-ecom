import axios from "axios";

export const ACCESS_TOKEN_KEY = "accessToken";

export const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //Gửi cookie refreshToken
});

export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as any;

    if (originalRequest.url.includes("auth/refresh-token")) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      const newToken = res.data.accessToken;
      localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (err) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);
