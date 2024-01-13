/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("sequence", (table) => {
    table.string("id").notNullable().unique();
    table.string("app_id").notNullable();
    table.string("description");
    table.string("frequency").notNullable();
    table.boolean("status").notNullable().defaultTo(true);
    table.string("traceid").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("sequence");
};
