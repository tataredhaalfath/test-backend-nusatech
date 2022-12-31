module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define(
    "Wallet",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      CurrencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field:"id_currency"
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "id_user",
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      tableName: "wallets",
      timestamp: true,
    }
  );
  Wallet.associate = function (models) {
    Wallet.belongsTo(models.User, { foreignKey: "id_user", as: "user" });
  };
  Wallet.associate = function (models) {
    Wallet.belongsTo(models.Currency, { foreignKey: "id_currency", as: "currency" });
  };
  return Wallet;
};
