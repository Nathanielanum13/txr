/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable("application", (table) => {
    table.dropColumn("id")
  }).alterTable("application", (table) => {
    table.string("id").notNullable().unique()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("application", (table) => {
    table.dropColumn("id")
  }).alterTable("application", (table) => {
    table.string("id").notNullable()
  })
};
