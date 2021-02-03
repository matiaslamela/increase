const {DISCOUNTS, discountTypes} = require ('../constants/discounts');
const Discounts = (sequelize, S) => {
	// defino el modelo
	const P = sequelize.define(
		DISCOUNTS,
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
          values: [
            discountTypes.IVA,
            discountTypes.Withholdings,
            discountTypes.commissions,
            discountTypes.extraCosts,
            discountTypes.grossIncome
            ]
        },
      },
		},
		{freezeTableName: true}
	);
	return P;
};
module.exports = Discounts;