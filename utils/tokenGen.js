module.exports = (length) => {
    const crypto = require('crypto');

    return crypto.randomBytes(length / 2).toString('hex');
}