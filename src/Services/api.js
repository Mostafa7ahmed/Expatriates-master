import axios from "axios";

const API_URL = "http://193.227.24.31:5050/api/v1/";

const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  export default api;
  