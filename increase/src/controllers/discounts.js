const db = require('../models')
const Discounts = db.Discounts

function getAllDiscounts() {
  return Discounts.findAll()
};

function getDiscountById(id) {
  return Discounts.findByPk(id);
};

function getDiscountsByPaymentId(paymentId) {
  return Discounts.findAll({
    where: {
      paymentId
    }
  })
};

module.exports = {
  getAllDiscounts,
  getDiscountsByPaymentId,
  getDiscountById
}