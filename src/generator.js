export function generateUsername({ prefix, suffix, digits, randomPartLength }) {
    let randomPart = '';
    for (let i = 0; i < randomPartLength; i++) {
        randomPart += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return prefix + randomPart + suffix;
}

