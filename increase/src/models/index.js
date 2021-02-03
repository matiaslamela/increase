const fs = require('fs');
const path = require('path');
const db = require('db.js');

const basename = path.basename(__filename);
const models = {};

models.conn = db();

fs
	.readdirSync(__dirname)
	.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
	.forEach((file) => {
		const model = models.conn.import(path.join(__dirname, file));
		const name = file.split('.')[0];
		models[name] = model;
	});

const {
  Discounts,
  Payments,
  Transactions,
  } = models;

Payments.hasMany(Transactions, {
  as: 'transactions',
  foreignKey: {name: 'paymentId', allowNull: false},
});
Transactions.belongsTo(Payments, {
  as: 'payment',
  foreignKey: {name: 'paymentId', allowNull: false},
});

Payments.hasMany(Discounts, {
  as: 'discounts',
  foreignKey: {name: 'paymentId', allowNull: false},
});
Discounts.belongsTo(Payments, {
  as: 'payment',
  foreignKey: {name: 'paymentId', allowNull: false},
});

module.exports = models;