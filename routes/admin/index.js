const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers').admin;

router.get('/', AdminController.indexAction);
// Bot Menu Routes
router.get('/bot-menu', AdminController.menuAction);
router.get('/bot-menu/add', AdminController.menuAddAction);
router.post('/bot-menu/add', AdminController.menuCreateAction);
router.get('/bot-menu/edit/:id', AdminController.menuEditAction);
router.post('/bot-menu/edit', AdminController.menuUpdateAction);
router.delete('/bot-menu/delete', AdminController.menuDeleteAction);
// Bot WebHook Routes
router.get('/bot-webhook', AdminController.webhookAction);
router.post('/bot-webhook', AdminController.setWebhookAction);
router.get('/bot-user', AdminController.telegramUserAction);

module.exports = router;