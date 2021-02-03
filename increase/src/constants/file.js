const HeaderEnum = {
  registerType: 1,
  paymentId: 32,
  reserved: 3,
  coin: 3,
  totalAmount: 13,
  totalDiscount: 13,
  totalWithDiscounts: 13
}

const HeaderEnumAcc = {
  registerType: 0,
  paymentId: 1,
  reserved: 33,
  coin: 36,
  totalAmount: 39,
  totalDiscount: 52,
  totalWithDiscounts: 65
}

const TransactionEnum = {
  registerType: 1,
  transactionId: 32,
  amount: 13,
  reserved: 5,
  type: 1,
}

const TransactionEnumAcc = {
  registerType: 0,
  transactionId: 1,
  amount: 33,
  reserved: 46,
  type: 51,
}

const  DiscountEnum = {
  registerType: 1,
  discountId: 32,
  amount: 13,
  reserved: 3,
  type: 1,
}

const  DiscountEnumAcc = {
  registerType: 0,
  discountId: 1,
  amount: 33,
  reserved: 46,
  type: 49,
}

const FooterEnum = {
  header: 1,
  reserved: 15,
  paymentDate: 8,
  clientId: 32,
}

const FooterEnumAcc = {
  header: 0,
  reserved: 1,
  paymentDate: 16,
  clientId: 24,
}

const  FileEnum = {
  header: '1',
  transaction: '2',
  discount: '3',
  footer: '4',
}

const fetchTime = 600000;

module.exports = {
  HeaderEnum,
  TransactionEnum,
  DiscountEnum,
  FooterEnum,
  HeaderEnumAcc,
  TransactionEnumAcc,
  DiscountEnumAcc,
  FooterEnumAcc,
  FileEnum,
  fetchTime
}