import axios from "axios";

const API_URL = "http://192.168.100.33:5000";

export const API = axios.create({
    baseURL: API_URL,
});