import { axiosClient } from "../axios";

const signin = async (email: string, password: string) => {
  const res = await axiosClient.post("/auth/login", { email, password });
  return res;
};

const signup = async (email: string, password: string) => {
  const res = await axiosClient.post("/auth/register", { email, password });
  return res;
};

const logout = async () => {
  await axiosClient.post("/auth/logout");
};

const getMe = async () => {
  const res = await axiosClient.get("/auth/me");
  return res;
};

export { signin, signup, logout, getMe };
