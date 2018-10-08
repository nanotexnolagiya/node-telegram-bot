const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers').auth;

router.get('/', AuthController.logoutAction);

module.exports = router;
