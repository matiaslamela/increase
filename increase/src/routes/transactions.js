const { Router } = require('express');
require('dotenv/config');
const router = Router();
const {getAllDiscounts, getDiscountById, getDiscountsByPaymentId} = require('../controllers/discounts');

router.get('/', (req, res) => {
  getAllDiscounts().then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(402)
  });
});

router.get('/:transactionId/id', (req, res) => {
  let transactionId = req.params.transactionId;
  getDiscountById(transactionId).then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(402)
  });
});

router.get('/:paymentId/payment', (req, res) => {
  let paymentId = req.params.paymentId;
  getDiscountsByPaymentId(paymentId).then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(402)
  });
});


module.exports = router;