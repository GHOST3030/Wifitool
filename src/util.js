import fs from 'fs';
import axios from 'axios';

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function loadTestedSet(file) {
    const set = new Set();
    if (fs.existsSync(file)) {
        const data = fs.readFileSync(file, 'utf-8').split(/\r?\n/).filter(Boolean);
        data.forEach(name => set.add(name));
    }
    return set;
}

export async function checkConnection(url) {
    try {
        await axios.get(url, { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}

