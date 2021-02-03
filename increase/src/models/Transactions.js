const {TRANSACTIONS, transactionTypes} = require ('../constants/transactions');
const Transactions = (sequelize, S) => {
	// defino el modelo
	const P = sequelize.define(
		TRANSACTIONS,
		{
			id: {
				type: S.STRING(32),
				allowNull: false,
				unique: true,
				primaryKey: true,
			},
			amount: {
				type: S.STRING(13),
				allowNull: false,
				validate: {
          notEmpty: true,
				},
      },
      type: {
				type: S.STRING(1),
				allowNull: false,
				validate: {
          notEmpty: true,
          values: [transactionTypes.approved, transactionTypes.rejected]
        },
      },
		},
		{freezeTableName: true}
	);
	return P;
};
module.exports = Transactions;