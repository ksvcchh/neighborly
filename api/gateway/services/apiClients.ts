import axios from "axios";

const USERS_URL = process.env.USERS_SERVICE_URL || "http://users-service:3001";

export const userApiClient = axios.create({
    baseURL: USERS_URL,
    timeout: 5000,
});
