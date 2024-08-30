module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_search_vector_boards()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector = to_tsvector(NEW.name || ' ' || NEW.author);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_update_search_vector_boards
      BEFORE INSERT OR UPDATE ON "boards"
      FOR EACH ROW EXECUTE FUNCTION update_search_vector_boards();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trg_update_search_vector_boards ON "boards";
      DROP FUNCTION IF EXISTS update_search_vector_boards;
    `);
  }
};
