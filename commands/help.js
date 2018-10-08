module.exports = (message, bot) => {
    const options = {
        reply_markup: JSON.stringify({
            keyboard: [
                ['Sotaman', 'Sotib olaman'],
                ['Orqaga']
            ],
            'resize_keyboard': true,
            'one_time_keyboard': true
        })
    };
    bot.sendMessage(message.chat.id, '/help All list command', options);
}