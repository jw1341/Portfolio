'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequences = [
      { table: 'ballot', column: 'ballot_id' },
      { table: 'societies', column: 'society_id' },
      { table: 'office', column: 'office_id' },
      { table: 'candidates', column: 'candidate_id' },
    ];

    for (const { table, column } of sequences) {
      const sequenceName = `${table}_${column}_seq`;

      // Create the sequence owned by the table.column
      await queryInterface.sequelize.query(`
        DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = '${sequenceName}'
            ) THEN
              CREATE SEQUENCE ${sequenceName} START WITH 1 OWNED BY ${table}.${column};
            END IF;
        END$$;

      `);

      // Set the sequence value to MAX(id) + 1 if records exist, or 1 if table is empty
      await queryInterface.sequelize.query(`
        DO $$
        DECLARE
          max_id integer;
        BEGIN
          SELECT MAX(${column}) INTO max_id FROM ${table};
          IF max_id IS NULL THEN
            PERFORM setval('${sequenceName}', 1, false);
          ELSE
            PERFORM setval('${sequenceName}', max_id + 1, false);
          END IF;
        END$$;
      `);

      // Set the default value for the column to use the sequence
      await queryInterface.sequelize.query(`
        ALTER TABLE ${table} ALTER COLUMN ${column} SET DEFAULT nextval('${sequenceName}');
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const sequences = [
      { table: 'ballot', column: 'ballot_id' },
      { table: 'societies', column: 'society_id' },
      { table: 'office', column: 'office_id' },
      { table: 'candidates', column: 'candidate_id' },
    ];

    for (const { table, column } of sequences) {
      const sequenceName = `${table}_${column}_seq`;

      // Remove default value from the column
      await queryInterface.sequelize.query(`
        ALTER TABLE ${table} ALTER COLUMN ${column} DROP DEFAULT;
      `);

      // Drop the sequence
      await queryInterface.sequelize.query(`
        DROP SEQUENCE IF EXISTS ${sequenceName};
      `);
    }
  }
};
