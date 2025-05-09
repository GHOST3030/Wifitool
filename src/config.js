import fs from 'fs';

export const CONFIG_FILE = 'config.json';

export function loadConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}

