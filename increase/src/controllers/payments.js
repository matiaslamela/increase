const db = require('../models')
const Payments = db.Payments
const Transactions = db.Transactions
const Discounts = db.Discounts

function getPayments() {
  return Payments.findAll()
};

function getClientPayments(clientId) {
  return Payments.findAll({
    where: {
      clientId
    },
  })
};

function getPaymentsAndDiscounts() {
  return Payments.findAll({
    include: {
      model: Discounts,
      as: 'discounts'
    }
  })
};

function getClientPaymentsAndDiscounts(clientId) {
  return Payments.findAll({
    where: {
      clientId
    },
    include: {
      model: Discounts,
      as: 'discounts'
    }
  })
};


function getPaymentsAndTransactions() {
  return Payments.findAll({
    include: {
      model: Transactions,
      as: 'transactions'
    }
  });
};

function getClientPaymentsAndTransactions(clientId) {
  return Payments.findAll({
    where: {
      clientId
    },
    include: {
      model: Transactions,
      as: 'transactions'
    }
  })
};

function getPaymentsDiscountsAndTransactions() {
  return Payments.findAll({
    include: [{
      model: Transactions,
      as: 'transactions'
    },{
      model: Discounts,
      as: 'discounts'
    }]
  })
};

function getClientPaymentsDiscountsAndTransactions(clientId) {
  return Payments.findAll({
    where: {
      clientId
    },
    include: [{
      model: Transactions,
      as: 'transactions'
    },{
      model: Discounts,
      as: 'discounts'
    }]
  })
};
function isPaidErrorHandler(isPaid) {
  if(!isPaid) {
    return false;
  } else if(isPaid === 'true') {
    return true;
  } else if(isPaid === 'false') {
    return true
  } else {
    return false
  }
}
function isPaidHandler(isPaid) {
  if(isPaid === 'true') {
    return true;
  } else if(isPaid === 'false') {
    return false
  }
}

function getClientPaymentsPaidOrUnpaid(clientId, isPaid) {
  return new Promise((res, rej) => {
    if (isPaidErrorHandler()) rej('isPaid query is required')
    Payments.findAll({
      where: {
        clientId,
        isPaid: isPaidHandler(isPaid)
      },
    }).then((e) => {
      res(e)
    }).catch((e) => {
      rej(e)
    })
  })
};

function putClientPaymentsPaidOrUnpaid(id, isPaid) {
  return new Promise((res, rej) => {
    if (isPaidErrorHandler()) rej('isPaid query is required')
    Payments.update({
        isPaid: isPaidHandler(isPaid)
      },
      {
        where: {
        id
      }
    }).then((e) => {
      res(e)
    }).catch((e) => {
      rej(e)
    })
  })
};

module.exports = {
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
}