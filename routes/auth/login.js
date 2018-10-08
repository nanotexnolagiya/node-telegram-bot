const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers').auth;

router.get('/', AuthController.loginAction);
router.post('/', AuthController.authAction);

module.exports = router;