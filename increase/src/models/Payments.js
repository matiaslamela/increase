const {PAYMENTS, coinTypes} = require ('../constants/payments');

const Payments = (sequelize, S) => {
	// defino el modelo
	const P = sequelize.define(
		PAYMENTS,
		{
			id: {
				type: S.STRING(32),
				allowNull: false,
				unique: true,
				primaryKey: true,
			},
			coin: {
				type: S.STRING(3),
				allowNull: false,
				validate: {
          isIn: [[coinTypes.ars, coinTypes.usd]]
				},
      },
      totalAmount: {
				type: S.STRING(13),
				allowNull: false,
				validate: {
					notEmpty: true,
        },
      },
			totalDiscount: {
				type: S.STRING(13),
				allowNull: false,
				validate: {
					notEmpty: true,
				},
      },
      totalWithDiscounts: {
				type: S.STRING(13),
				allowNull: false,
				validate: {
					notEmpty: true,
				},
      },
      paymentDate: {
				type: S.DATE,
				allowNull: true,
      },
      isPaid: {
        type: S.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      clientId: {
				type: S.STRING(32),
				allowNull: true,
			},
		},
		{freezeTableName: true}
	);
	return P;
};
module.exports = Payments;