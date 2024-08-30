module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_boards_search_vector
      ON "boards" USING GIN (search_vector);
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_boards_search_vector;
      `);
  }
};
