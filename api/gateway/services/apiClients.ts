import axios from "axios";

const USERS_URL = `${process.env.URI}:${process.env.USERS_PORT}`;

if (!USERS_URL) {
    throw new Error("USER_SERVICE_URL environment variable is not set.");
}

export const userApiClient = axios.create({
    baseURL: USERS_URL,
    timeout: 5000,
});
