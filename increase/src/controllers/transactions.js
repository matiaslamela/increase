const db = require('../models')
const Transactions = db.Transactions

function getAllTransactions() {
  return Transactions.findAll()
};

function getTransactionsById(id) {
  return Transactions.findByPk(id);
};

function getTransactionsByPaymentId(paymentId) {
  return Transactions.findAll({
    where: {
      paymentId
    }
  })
};

module.exports = {
  getAllTransactions,
  getTransactionsById,
  getTransactionsByPaymentId
}