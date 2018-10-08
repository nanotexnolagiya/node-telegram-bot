const bcrypt = require('bcrypt');
const {
    User
} = require('../models');

const loginAction = async (req, res) => {
    const userId = req.session.userId;
    console.log(userId);

    if (userId) {
        res.redirect('/admin');
        return;
    }

    res.render('login');
}

const authAction = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    let errors = [];
    if (!email && !password) {
        if (!email) errors.push('E-mail empty');
        if (!password) errors.push('Password empty');
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        )) {
        errors.push('E-mail in valid');
    } else {
        errors = false;
    }

    if (errors) {
        res.render('login', {
            errors
        });
    } else {
        try {
            const user = await User.findOne({
                email
            });

            if (await bcrypt.compare(password, user.password)) {
                req.session.userId = user.id;

                res.redirect('/admin');
            } else {
                res.render('login', {
                    errors: ['Error email or password']
                });
            }
        } catch (error) {
            console.log(error);
            res.render('login', {
                errors: ['Error email or password']
            });
        }
    }
}

const logoutAction = async (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy(() => {
            res.redirect('/admin');
        });
    } else {
        res.redirect('/admin');
    }
}

module.exports = {
    loginAction,
    authAction,
    logoutAction
}