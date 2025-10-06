import axios from "axios";

const api = axios.create({
  baseURL: "https://jhcscattendance.pythonanywhere.com", // Replace with your backend URL
  // http://10.0.2.2:8000  -> python manage.py runserver 0.0.0.0:8000
  // https://jhcscattendance.pythonanywhere.com
  timeout: 10000, // optional, 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
