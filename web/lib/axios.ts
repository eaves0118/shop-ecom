import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, //Gửi cookie refreshToken
});
