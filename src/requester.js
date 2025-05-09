import axios from 'axios';
import { log } from './logger.js';

export async function sendRequest({ url, method, username }) {
    if (method === "POST") {
        return await axios.post(url, new URLSearchParams({ username }));
    } else if (method === "GET") {
        return await axios.get(url, { params: { username } });
    } else {
        log.error(`[!] Unsupported method: ${method}`);
        return null;
    }
}

export async function logout(logout_url, username) {
    try {
        await axios.post(logout_url, new URLSearchParams({ username }));
        log.success(`[!] Logout request sent for ${username}`);
    } catch (err) {
        log.error(`[!] Logout failed: ${err}`);
    }
}

export async function checkServerConnection(url) {
    try {
        await axios.get(url, { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}
