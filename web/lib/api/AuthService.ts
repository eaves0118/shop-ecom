import { axiosClient } from "../axios";

const signin = async (username: string, password: string) => {
  const res = await axiosClient.post("/auth/login", { username, password });
  return res;
};

const signup = async (username: string, password: string) => {
  const res = await axiosClient.post("/auth/register", { username, password });
  return res;
};

export { signin, signup };
