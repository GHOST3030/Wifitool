import enquirer from 'enquirer';
const { Select, Input } = enquirer;
import fs from 'fs';

// قراءة الإعدادات الموجودة
let config = {};
const configPath = './config.json';

if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} else {
    console.log('[-] No config found. Starting fresh.');
}
// دالة لتحديث الإعداد
async function modifyConfig() {
    while (true) {
        const prompt = new Select({
            name: 'option',
            message: 'What do you want to modify?',
            choices: [
                { name: 'url', message: `URL: ${config.url || 'Not set'}` },
                { name: 'logout_url', message: `Logout URL: ${config.logout_url || 'Not set'}` },
                { name: 'method', message: `Method: ${config.method || 'Not set'}` },
                { name: 'length', message: `Length: ${config.length || 'Not set'}` },
                { name: 'digits', message: `Digits: ${config.digits || 'Not set'}` },
                { name: 'prefix', message: `Prefix: ${config.prefix || 'Not set'}` },
                { name: 'suffix', message: `Suffix: ${config.suffix || 'Not set'}` },
                { name: 'count', message: `Count: ${config.count || 'Not set'}` },
                { name: 'save_exit', message: 'Save & Exit' }
            ]
        });

        const choice = await prompt.run();

        if (choice === 'save_exit') {
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log('[+] Config saved successfully.');
            break;
        }

        const valuePrompt = new Input({
            name: 'value',
            message: `Enter new value for ${choice}:`
        });

        const newValue = await valuePrompt.run();

        if (['length', 'count'].includes(choice)) {
            config[choice] = parseInt(newValue);
        } else {
            config[choice] = newValue;
        }
    }
}

// بدء البرنامج
modifyConfig();

