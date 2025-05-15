'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.createTable('ETL_PRODUTOS', {
      SK_PRODUTOS: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      NK_PRODUTO: {
        type: Sequelize.STRING,
      },
      DESC_PRODUTO: {
        type: Sequelize.STRING,
      },
      DESC_UM: {
        type: Sequelize.STRING,
      },
      COD_ROTEIRO: {
        type: Sequelize.STRING,
      },
      COD_OPERACAO: {
        type: Sequelize.STRING,
      },
      DESC_OPERACAO: {
        type: Sequelize.STRING,
      },
      COD_ENDERECO: {
        type: Sequelize.STRING,
      },
      DESC_ENDERECO: {
        type: Sequelize.STRING,
      },
      DESC_LINHA_ENDERECO: {
        type: Sequelize.STRING,
      },
      CREATED_AT: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      UPDATED_AT: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      D_E_L_E_T_: {
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
