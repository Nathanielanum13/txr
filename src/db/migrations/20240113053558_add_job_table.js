/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("job", (table) => {
      table.string("id").notNullable().unique()
      table.string("seq_id").notNullable()
      table.string("to")
      table.string("type").notNullable()
      table.jsonb("options")
      table.boolean("status").notNullable().defaultTo(true)
      table.string("traceid").notNullable()
      table.timestamps(true, true)
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable("job")
  };
  