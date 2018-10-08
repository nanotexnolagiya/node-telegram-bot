const TelegramApi = require('node-telegram-bot-api');
const R = require('ramda');
const config = require('../config');
const {
    BotMenu,
    TelegramUser
} = require('../models');
const bot = new TelegramApi(config.BOT_TOKEN);
const startCommand = require('../commands/start');
const stopCommand = require('../commands/stop');
const helpCommand = require('../commands/help');

const indexAction = async (req, res) => {
    console.log('i', req.body.message.text, '--------------------------');
    bot.processUpdate(req.body);
    res.sendStatus(200);
}



bot.on('inline_query', query => {
    const results = [];
    console.log(query);

    results.push({
        id: '1',
        type: 'article',
        title: 'Start Bot',
        input_message_content: {
            message_text: '/start'
        }
    });

    bot.answerInlineQuery(query.id, results, {
        cache_time: 0,
        switch_pm_text: 'Go Agro Bot',
        switch_pm_parameter: 'hello'
    });
});

// Just to ping!
bot.on('message', async message => {
    const text = message.text;

    if (!/\/start/.test(text)) {

        if (!message.contact) {

            try {

                const user = await TelegramUser.findOne({
                    chat_id: message.chat.id
                });

                console.log(user.temp_orders);

                let menues, currentMenu, steps;
                let home = false;

                if (/↩(.+)/.test(text)) {
                    steps = user.steps;
                    steps.pop();

                    if (steps.length > 0) {
                        currentMenu = await BotMenu.findOne({
                            where: {
                                id: steps[steps.length - 1]
                            }
                        });
                    } else {
                        currentMenu = {
                            text: 'Tilni tanlang:'
                        }

                        home = true;
                    }

                    await TelegramUser.update({
                        steps,
                        temp_orders: []
                    }, {
                        where: {
                            chat_id: message.chat.id
                        }
                    });

                    menues = await BotMenu.findAll({
                        where: {
                            pid: steps.length > 0 ? steps[steps.length - 1] : 0
                        },
                        order: [
                            ['id', 'ASC']
                        ]
                    });
                } else if (/🏠(.+)/.test(text)) {

                    currentMenu = {
                        text: 'Tilni tanlang:'
                    }
                    home = true;

                    await TelegramUser.update({
                        steps: [],
                        temp_orders: []
                    }, {
                        where: {
                            chat_id: message.chat.id
                        }
                    });

                    menues = await BotMenu.findAll({
                        where: {
                            pid: 0
                        },
                        order: [
                            ['id', 'ASC']
                        ]
                    });
                } else {

                    if (user.temp_orders.length == 0) {
                        steps = user.steps;

                        currentMenu = await BotMenu.findOne({
                            where: {
                                name: text,
                                pid: steps.length > 0 ? steps[steps.length - 1] : 0
                            }
                        });
                        steps.push(currentMenu.id)

                        await TelegramUser.update({
                            steps
                        }, {
                            where: {
                                chat_id: message.chat.id
                            }
                        });

                        menues = await BotMenu.findAll({
                            where: {
                                pid: currentMenu.id
                            },
                            order: [
                                ['id', 'ASC']
                            ]
                        });

                    } else if (user.temp_orders.length == 1) {
                        let orders = user.temp_orders;
                        orders.push(text);
                        user.temp_orders = orders;
                        await user.save();

                        menues = [{
                            name: '🏁 Tugatish'
                        }];

                        currentMenu = {
                            text: 'E\'longa tegishli 1 dona rasm yuklang!\n' +
                                '👉Rasm yuklash uchun 📎belgisini bosing.\n' +
                                '👉 Esingizda bo\'lsin e\'lon rasm bilan yaxshiroq ko\'rinadi va xaridorlar e\'tiborini tortadi.\n' +
                                '❗️Rasm yo\'q bo\'lsa "Tugatish" tugmasini bosing.'
                        }
                    } else if (user.temp_orders.length == 2) {
                        let photo = message.photo;
                        let file = bot.getFileLink(message.photo[photo.length - 1].file_id);
                        let orders = user.temp_orders;
                        orders.push(text);
                        user.temp_orders = orders;

                        menues = [{
                            name: '🏁 Tugatish'
                        }];

                        currentMenu = {
                            text: '"Tugatish" tugmasini bosing.'
                        }
                        console.log(file);
                    }

                }

                if (menues.length > 0) {
                    let options = {
                        reply_markup: {
                            keyboard: [],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    };
                    let keyboard = menues.map(menu => {
                        return menu.name;
                    });

                    if (keyboard.length > 2) {
                        keyboard = R.aperture(2, keyboard);
                    } else {
                        keyboard = [keyboard];
                    }

                    if (!home) {
                        keyboard.push(['↩ Orqaga', '🏠 Boshiga']);
                    } else {

                    }

                    options.reply_markup.keyboard = keyboard;
                    bot.sendMessage(message.chat.id, currentMenu.text, options);
                } else {
                    bot.sendMessage(message.chat.id, currentMenu.text, {
                        reply_markup: {
                            keyboard: [
                                [{
                                    text: 'Raqamni yuborish',
                                    request_contact: true
                                }]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });
                }
            } catch (error) {
                console.log(error);
                bot.sendMessage(message.chat.id, 'Comanda hato kiritilgan!');
            }
        } else {
            const user = await TelegramUser.findOne({
                chat_id: message.chat.id
            });
            let steps = user.steps;
            if (steps.length > 0) {
                let last = steps.length - 1;
                const menus = await BotMenu.findAll({
                    where: {
                        pid: steps[last]
                    }
                });

                if (menus.length == 0) {
                    user.phone = message.contact.phone_number;
                    user.temp_orders = [message.contact.phone_number];
                    await user.save();
                    let sText = 'E\'lonni to\'liq kiriting. Namuna: \n';
                    sText += 'Mosh, tozalangan, 5tn (5000kg), 50kg qoldi, Pahtakor tumani Jizzah';
                    bot.sendMessage(message.chat.id, sText, {
                        parse_mode: "Markdown"
                    });
                }
            }
        }
    }
});

bot.onText(/\/start/, async (message, match) => {
    const full_name = message.chat.first_name + ' ' + message.chat.last_name;
    const chat_id = message.chat.id;
    const username = message.chat.username;
    try {
        const startMenu = await BotMenu.findAll({
            where: {
                pid: 0
            }
        });

        const user = await TelegramUser.findOne({
            where: {
                chat_id: message.chat.id
            }
        });

        if (user) {
            user.full_name = full_name;
            user.username = username;
            user.steps = [];
            user.temp_orders = [];
            await user.save();
        } else {
            await TelegramUser.create({
                chat_id,
                full_name,
                username,
                steps: []
            });
        }

        let options = {
            reply_to_message_id: message.message_id,
            reply_markup: {
                keyboard: [],
                'resize_keyboard': true,
                'one_time_keyboard': true
            }
        };

        let menuArr = startMenu.map(menu => {
            return menu.name
        });

        options.reply_markup.keyboard.push(menuArr);

        startCommand(message, bot, options, full_name);
    } catch (error) {
        console.log(error);
    }
});

bot.onText(/\/help/, (message, match) => {
    helpCommand(message, bot);
});

bot.onText(/Sotaman/, (message, match) => {
    let options = {
        reply_to_message_id: message.message_id,
        reply_markup: {
            keyboard: [
                ['Dukakli mahsulotlar', 'Don mahsulotlari'],
                ['Urug\' mahsulotlari', 'Yong\'oq mahsulotlari'],
                ['Zirovorlar', 'Quruq mevalar'],
                ['Boshqa'],
                ['Orqaga']
            ],
            'resize_keyboard': true,
            'one_time_keyboard': true
        }
    };
    console.log(message);
    bot.sendMessage(message.chat.id, 'Toifani tanlang:', options);
});



module.exports = {
    indexAction
}