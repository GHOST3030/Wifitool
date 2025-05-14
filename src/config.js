import fs from 'fs';

const CONFIG_FILE = 'config.json';

export function loadConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}

export function getConfigLastModified() {
    return fs.statSync(CONFIG_FILE).mtimeMs;
}

