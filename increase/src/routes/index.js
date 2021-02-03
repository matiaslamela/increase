const {Router} = require('express');
const transactions = require('./transactions');
const discounts = require('./discounts');
const clients = require('./clients')
const init = require('./init');
const payments = require('./payments');
const router = Router();


router.use('/transactions', transactions);
router.use('/init', init);
router.use('/discounts', discounts);
router.use('/clients', clients);
router.use('/payments', payments);

module.exports = router;