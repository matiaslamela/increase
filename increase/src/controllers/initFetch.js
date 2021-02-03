const {
  FileEnum,
  HeaderEnum,
  TransactionEnum,
  DiscountEnum,
  FooterEnum,
  HeaderEnumAcc,
  TransactionEnumAcc,
  DiscountEnumAcc,
  FooterEnumAcc,
  fetchTime } = require('../constants/file');

require('dotenv/config');

const API = require('../constants/API');
const axios = require('axios').default;
const increaseToken = process.env.TOKEN
const { transactionTypes } = require('../constants/transactions');
const { discountTypes } = require('../constants/discounts');
const { dateCount } = require('../constants/payments')
const discountPosibleValues = Object.values(discountTypes);
const transactionPosibleValues = Object.values(transactionTypes);
const db = require('../models')
const Payments = db.Payments
const Transactions = db.Transactions
const Discounts = db.Discounts
var interval;

function intervalFunc() {
  return new Promise((res, rej) => {
    if (!interval) {
      interval = setInterval(storeData, fetchTime)
      res('the interval is initialized')
    } else {
      rej('the interval is already initialized')
    }
  })
}
function clearIntervalFunc() {
  return new Promise((res, rej) => {
    if (!!interval) {
      clearInterval(interval)
      res('the interval is clear')
    } else {
      rej('the interval is not initialized')
    }
  })
  
}

function createArray(file_txt) {
  return new Promise((res, rej) => {
      let data = file_txt.split('\n');
      if (!!data && Array.isArray(data)) {
        res(data);
      } else {
        rej('data error at createArray function')
      }
  })
}
function whatType(string) {
  return string.substr(0, 1);
}
function checkTypeErrors(posibleValuesArray, type) {
  for(let i = 0; i < posibleValuesArray.length; i++) {
    if (posibleValuesArray[i] === type) return true;
  }
  return false;
}
function handleHeader(string) {
  return {
    id: string.substr(HeaderEnumAcc.paymentId, HeaderEnum.paymentId),
    coin: string.substr(HeaderEnumAcc.coin, HeaderEnum.coin),
    totalAmount: string.substr(HeaderEnumAcc.totalAmount, HeaderEnum.totalAmount),
    totalDiscount: string.substr(HeaderEnumAcc.totalDiscount, HeaderEnum.totalDiscount),
    totalWithDiscounts: string.substr(HeaderEnumAcc.totalWithDiscounts, HeaderEnum.totalWithDiscounts),
  }
}
function handleTransaction(string) {
  let transaction = {
    id: string.substr(TransactionEnumAcc.transactionId, TransactionEnum.transactionId),
    amount: string.substr(TransactionEnumAcc.amount, TransactionEnum.amount),
    type: string.substr(TransactionEnumAcc.type, TransactionEnum.type),
  }
  if (checkTypeErrors(transactionPosibleValues, transaction.type)) {
    return transaction
  } else {
    return false
  }
}

function handleDiscount(string) {
  var discount = {
    id: string.substr(DiscountEnumAcc.discountId, DiscountEnum.discountId),
    amount: string.substr(DiscountEnumAcc.amount, DiscountEnum.amount),
    type: string.substr(DiscountEnumAcc.type, DiscountEnum.type),
  }
  if(checkTypeErrors(discountPosibleValues, discount.type)){
    return discount;
  } else {
    return false;
  };
};
function handleDate(dateString) {
  let day = dateString.substr(6, dateCount.days);
  let month = dateString.substr(4, dateCount.month);
  let year = dateString.substr(0, dateCount);
  let today = new Date()
  let paymentDate = new Date(`${month}/${day}/${year}`)
  let isPaid = paymentDate < today
  return {paymentDate, isPaid};
}
function handleFooter(string) {
  const {paymentDate, isPaid} = handleDate(string.substr(FooterEnumAcc.paymentDate, FooterEnum.paymentDate))
  return {
    paymentDate,
    isPaid,
    clientId: string.substr(FooterEnumAcc.clientId, FooterEnum.clientId)
  }
}
function createDataStructure(array) {
  return new Promise((res, rej) => {
    var data = {
      payments: [],
      transactions: [],
      discounts: []
    };
    var payment = {}

    for (let i = 0; i < array.length; i++) {
      if(FileEnum.header === whatType(array[i])) {
        payment = handleHeader(array[i]);
      }
      if(FileEnum.transaction === whatType(array[i])) {
        var transaction = handleTransaction(array[i])
        if(!!transaction) {
          data.transactions.push({
            ...transaction,
            paymentId: payment.id
          });
        }
      }
      if(FileEnum.discount === whatType(array[i])) {
        let discount = handleDiscount(array[i]);
        if(!!discount) data.discounts.push({
          ...discount,
          paymentId: payment.id});
      }
      if(FileEnum.footer === whatType(array[i])) {
        let = paymentFooter = handleFooter(array[i])
        data.payments.push({
          ...paymentFooter,
          ...payment
        });
        payment = {};
      }
    }
    if(!!data) {
      res(data);
    } else {
      rej('data error at createDataStructure function')
    }
  })
}

function updateDatabase(data) {
  return new Promise((res, rej) => {
    Payments.bulkCreate(data.payments)
      .then(() => {
        return Transactions.bulkCreate(data.transactions)
      }).then(() => {
        return Discounts.bulkCreate(data.discounts)
      }).then(() => {
        res('the database update is completed');
      }).catch((e) => {
        rej(e)
      })
  })
}
function fetchData() {
  return new Promise((res, rej)=> {
    axios.get(`${API.baseUrl}${API.file}`, {
      headers: {
        'Authorization' : `Bearer ${increaseToken}`
      }
    }).then(response => {
      res(response)
    }).catch(error =>  {
      rej(error)
    })
  })
}
function storeData() {
  return fetchData()
  .then((response) => {
    return createArray(response.data)
  }).then((array) => {
    return createDataStructure(array)
  }).then((dataStructure) => {
    return updateDatabase(dataStructure)
  }).then((status) => {
    return status;
  }).catch((error) => {
    return error;
  })
}
function init() {
  return storeData().then(() => {
    return intervalFunc()
  }).then((response) => {
    return response;
  }).catch((error) => {
    return error
  })
}

module.exports = {
  createArray,
  createDataStructure,
  updateDatabase,
  init,
  intervalFunc,
  clearIntervalFunc
};