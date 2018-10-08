const dotenv = require('dotenv').config();
const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    BOT_TOKEN: process.env.BOT_TOKEN
};