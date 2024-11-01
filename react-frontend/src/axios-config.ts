import axios from "axios";
import { BASE_SERVER_URL } from "src/utils/utils";

const instance = axios.create({
  baseURL: BASE_SERVER_URL,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
