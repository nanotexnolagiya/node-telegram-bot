module.exports = (message, bot, options, username = '') => {
    bot.sendMessage(message.chat.id, 'Hush Kelibsiz ' + username + '!!! \nTilni tanlang:', options);
}