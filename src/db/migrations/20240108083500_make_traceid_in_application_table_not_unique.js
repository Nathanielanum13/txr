/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("application", (table) => {
        table.dropColumn("traceid")
    }).alterTable("application", (table) => {
        table.string("traceid").notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("application", (table) => {
        table.dropColumn("traceid")
    }).alterTable("application", (table) => {
        table.string("traceid").notNullable().unique()
    })
};
