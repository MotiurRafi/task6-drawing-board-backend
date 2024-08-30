'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('boards', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "boards"
      SET search_vector = to_tsvector(COALESCE("name", '') || ' ' || COALESCE("author", ''));
    `);

    await queryInterface.changeColumn('boards', 'search_vector', {
      type: Sequelize.TSVECTOR,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('boards', 'search_vector');
  },
};
