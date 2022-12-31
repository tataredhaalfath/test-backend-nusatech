'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("wallets", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      id_currency: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("wallets", {
      type: "foreign key",
      name: "WALLETS_USER_ID",
      fields: ["id_user"],
      references: {
        table: "users",
        field: "id",
      },
    });
    await queryInterface.addConstraint("wallets", {
      type: "foreign key",
      name: "WALLETS_CURRENCY_ID",
      fields: ["id_currency"],
      references: {
        table: "currencys",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('mailers');
     
  }
};
