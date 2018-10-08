const express = require('express');
const router = express.Router();
const TelegramController = require('../../controllers').telegram;

router.post('/', TelegramController.indexAction);

module.exports = router;