const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask questions
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function getUserConfig() {
    const url = await askQuestion('Enter login URL (url): ');
    const logout_url = await askQuestion('Enter logout URL (logout_url): ');
    const method = await askQuestion('Enter request method (POST or GET): ');
    const length = parseInt(await askQuestion('Enter username length (length): '));
    const digits = await askQuestion('Enter digits for username generation (e.g., 0123456789): ');
    const prefix = await askQuestion('Enter prefix (prefix): ');
    const suffix = await askQuestion('Enter suffix (suffix): ');
    const count = parseInt(await askQuestion('Enter the number of usernames to test (count): '));

    // Save settings to config.json
    const config = {
        url,
        logout_url,
        method,
        length,
        digits,
        prefix,
        suffix,
        count
    };

    // Write the settings to config.json file
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    console.log('[+] Settings have been saved to config.json');

    rl.close();  // Close readline interface after input
}

// Call the function to start input
getUserConfig();

