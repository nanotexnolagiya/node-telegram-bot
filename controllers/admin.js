const {
    User,
    Setting,
    BotMenu,
    TelegramUser
} = require('../models');
const bot = require('./bot');
const config = require('../config');

const getUserName = async (userId) => {
    console.log(userId);
    if (userId === undefined) return false
    try {
        const user = await User.findById(userId);
        return user.name;
    } catch (error) {
        console.log(error);
        return false
    }
}

const indexAction = async (req, res) => {
    const userId = req.session.userId;
    const userName = await getUserName(userId);

    if (!userName) {
        res.redirect('/login');
        return;
    }

    console.log(userName);

    res.render('admin', {
        userName
    });
}

const menuAction = async (req, res) => {
    const userId = req.session.userId;
    const userName = await getUserName(userId);

    if (!userName) {
        res.redirect('/login');
        return;
    }

    try {
        const menues = await BotMenu.findAll({
            order: [
                ['id', 'ASC']
            ],
        });

        res.render('menu', {
            userName,
            menues
        });
    } catch (error) {
        console.log(error);
    }

}

const menuAddAction = async (req, res) => {

    const userId = req.session.userId;
    const userName = await getUserName(userId);

    if (!userName) {
        res.redirect('/login');
        return;
    }

    try {
        const menues = await BotMenu.findAll({});

        res.render('menu-add', {
            userName,
            menues
        });
    } catch (error) {
        console.log(error);
    }
}

const menuCreateAction = async (req, res) => {
    const userId = req.session.userId;
    const userName = await getUserName(userId);
    const name = req.body.name;
    const text = req.body.text;
    const pid = parseInt(req.body.pid);

    if (!userName) {
        res.redirect('/login');
        return;
    }

    try {
        await BotMenu.create({
            name,
            text,
            pid
        });
        res.redirect('/admin/bot-menu');
    } catch (error) {
        console.log(error);
    }
}

const menuEditAction = async (req, res) => {
    const userId = req.session.userId;
    const userName = await getUserName(userId);
    const id = req.params.id;

    if (!userName) {
        res.redirect('/login');
        return;
    }

    try {
        const menu = await BotMenu.findById(id);
        const menues = await BotMenu.findAll({});

        res.render('menu-edit', {
            userName,
            menu,
            menues
        });
    } catch (error) {
        console.log(error);
    }
}

const menuUpdateAction = async (req, res) => {
    const userId = req.session.userId;
    const userName = await getUserName(userId);
    const name = req.body.name;
    const text = req.body.text;
    const pid = req.body.pid;
    const id = req.body.id;

    if (!userName) {
        res.redirect('/login');
        return;
    }

    try {
        await BotMenu.update({
            name,
            text,
            pid
        }, {
            where: {
                id
            }
        });
        res.redirect('/admin/bot-menu');
    } catch (error) {
        console.log(error);
    }
}

const menuDeleteAction = async (req, res) => {
    const userId = req.session.userId;
    const userName = await getUserName(userId);
    const id = req.body.id;

    if (!userName) {
        res.redirect('/login');
        return;
    }

    try {
        await BotMenu.destroy({
            where: {
                id
            }
        });
        res.send({
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.send({
            ok: false
        });
    }
}

const webhookAction = async (req, res) => {
    const userId = req.session.userId;
    const userName = await getUserName(userId);
    let message = {
        url: ''
    }

    if (!userName) {
        res.redirect('/login');
        return;
    }

    try {
        const setting = await Setting.findOne({
            key: 'webhook_url'
        });

        if (setting) {
            message.url = setting.value;
        }
    } catch (error) {
        console.log(error);
    }

    res.render('webhook', {
        userName,
        message
    });
}

const setWebhookAction = async (req, res) => {
    const url = req.body.webhook_url;
    const userId = req.session.userId;
    const userName = await getUserName(userId);
    let message = {
        ok: false,
        message: [],
        url: false
    };

    if (!userName) {
        res.redirect('/login');
        return;
    }

    if (url.length < 8) {
        message.message.push('Un Correct Uri');
    } else {
        try {
            const setting = await Setting.findOne({
                key: 'webhook_url'
            });

            if (setting) {
                setting.value = url;
                await setting.save();
                message.message.push('Webhook update');
                message.ok = true
                message.url = url
            } else {
                const newSetting = await Setting.create({
                    key: 'webhook_url',
                    value: url
                });
                message.message.push('Webhook Save');
                message.ok = true
                message.url = url
            }

        } catch (error) {
            console.log(error);
        }

        // Set Webhook
        const result = await bot.setWebHook(url + '/' + config.BOT_TOKEN);
        if (result) {
            message.message.push('setWebHook complete url: ' + url + '/' + config.BOT_TOKEN);
        } else {
            console.log(result);
        }
    }

    res.render('webhook', {
        userName,
        message
    });
}

const telegramUserAction = async (req, res) => {
    try {
        const users = await TelegramUser.findAll({});

        res.render('t-users', {
            users
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    indexAction,
    menuAction,
    webhookAction,
    telegramUserAction,
    setWebhookAction,
    menuAddAction,
    menuCreateAction,
    menuEditAction,
    menuUpdateAction,
    menuDeleteAction
}