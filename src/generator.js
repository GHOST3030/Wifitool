export function generateUsername(length, digits, prefix, suffix) {
    let randomPart = '';
    const randomLength = length - prefix.length - suffix.length;
    for (let i = 0; i < randomLength; i++) {
        randomPart += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return prefix + randomPart + suffix;
}

