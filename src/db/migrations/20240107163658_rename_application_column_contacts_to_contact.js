/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("application", (table) => {
        table.dropColumn("contacts")
        table.jsonb("contact");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("application", (table) => {
        table.dropColumn("contact")
        table.jsonb("contacts");
    })
};
