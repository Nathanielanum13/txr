/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("job_type", (table) => {
    table.string("id").notNullable().unique()
    table.string("name").notNullable()
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
  return knex.schema.dropTable("job_type")
};
