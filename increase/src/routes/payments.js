const { Router } = require('express');
const router = Router();
const {
  getPayments,
  getClientPayments,
  getPaymentsAndDiscounts,
  getClientPaymentsAndTransactions,
  getClientPaymentsAndDiscounts,
  getClientPaymentsDiscountsAndTransactions,
  getPaymentsAndTransactions,
  getPaymentsDiscountsAndTransactions,
  getClientPaymentsPaidOrUnpaid,
  putClientPaymentsPaidOrUnpaid
  } = require('../controllers/payments');

router.get('/:clientId/client/discounts/transactions', (req, res) => {
  const clientId = req.params.clientId;
  getClientPaymentsDiscountsAndTransactions(clientId).then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/:clientId/client/discounts', (req, res) => {
  const clientId = req.params.clientId;
  getClientPaymentsAndDiscounts(clientId).then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/:clientId/client/transactions', (req, res) => {
  const clientId = req.params.clientId;
  getClientPaymentsAndTransactions(clientId).then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/:clientId/client', (req, res) => {
  const clientId = req.params.clientId;
  getClientPayments(clientId).then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/', (req, res) => {
  getPayments().then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/discounts', (req, res) => {
  getPaymentsAndDiscounts().then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/transactions', (req, res) => {
  getPaymentsAndTransactions().then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/discounts/transactions', (req, res) => {
  getPaymentsDiscountsAndTransactions().then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.get('/:clientId/client/:isPaid/ispaid', (req, res) => {
  let {isPaid, clientId} = req.params;
  getClientPaymentsPaidOrUnpaid(clientId, isPaid).then(e => {
    return res.send(e)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

router.put('/:id/id/:isPaid/ispaid', (req, res) => {
  let {id, isPaid} = req.params;
  putClientPaymentsPaidOrUnpaid(id, isPaid).then(e => {
    return res.sendStatus(200)
  }).catch((e) => {
    return res.sendStatus(500)
  });
});

module.exports = router;