const TelegramApi = require('node-telegram-bot-api');
const config = require('../config');

const bot = new TelegramApi(config.BOT_TOKEN);

module.exports = bot;