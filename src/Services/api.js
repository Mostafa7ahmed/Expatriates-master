import axios from "axios";

const API_URL = "https://stage.menofia.edu.eg/api/v1/";

const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  export default api;
  