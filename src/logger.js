import chalk from 'chalk';
import fs from 'fs';
import { exec } from 'child_process';

export function playSound(file) {
    exec(`mpv "${file}"`, (err) => {
        if (err) {
//            console.log('[!] Failed to play sound:', err.message);
        }
    });
}
export function logOut(username){
console.log(chalk.green(`[+] Logged out successfully`));
}

export function logBanner(toolName, config) {
    console.log(chalk.cyan("=".repeat(60)));
    console.log(chalk.green(`             ${toolName}`));
    console.log(chalk.cyan("=".repeat(60)));
    console.log(chalk.green("Developed By Ghost Telegram @GHOST_529"));
    console.log(chalk.cyan("=".repeat(50)));
    console.log(chalk.yellow(`Target: ${config.url}`));
    console.log(chalk.yellow(`Method: ${config.method}`));
    console.log(chalk.yellow(`Usernames to Test: ${config.count}`));
    console.log(chalk.yellow(`Username Format: ${config.prefix}[random]${config.suffix}`));
    console.log(chalk.yellow(`Random Length: ${config.length - config.prefix.length - config.suffix.length}`));
    console.log(chalk.cyan("=".repeat(50)));
}
export function PrintTime(T) {
    console.log(chalk.gray(`Token Time ${T}`));
}
export function logValid(username,n) {
    const now = new Date().toLocaleString(); // الوقت والتاريخ الحالي
    const logLine = `${username} - ${now}`;
    console.log(chalk.green(`[+] Valid ${username +  n}`));
    playSound('success.mp3');
//    logToFile('../valid_usernames.txt', logLine);
}

export function logInvalid(username,n) {
    console.log(chalk.red(`[-] Invalid: ${username + n}`));
}

export function logError(err, username) {
    console.log(chalk.red(`[!] Request failed for ${username}: ${err.message}`));
}

export function logToFile(file, line) {
 // fs.appendFileSync("valid_usernames.txt", `${username} - Time: ${now}\n`);
    fs.appendFileSync(file, line + '\n');
}

