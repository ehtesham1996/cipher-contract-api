const express = require('express');
const router = express.Router();
const ethereumController = require('../controllers/ethereumController');

router.post('/wallet/create', ethereumController.createWallet);
router.get('/wallet/balance/:address', ethereumController.getBalance);
router.post('/wallet/fund', ethereumController.fundWallet);
router.post('/wallet/withdraw', ethereumController.withdrawFromWallet);
router.get('/contract-info/:address', ethereumController.getContractInfo);

module.exports = router;