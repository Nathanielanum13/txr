import knex from "knex";
import path from "path"

const knexConfig = {
  client: "postgresql",
  connection: {
    database: process.env.TXR_DB_NAME,
    user: process.env.TXR_DB_USERNAME,
    password: process.env.TXR_DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
}

export default async function dbConnect() {
  const databaseConnection = knex(knexConfig);
  return databaseConnection
}

// Run migration
export async function runMigrations(databaseConnection: knex.Knex<any, unknown[]>) {
  try {
    await databaseConnection.migrate.latest({
      directory: path.join(import.meta.dir, "/migrations")
    });
    console.log("Migrations ran successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    // Close the database connection
    await databaseConnection.destroy(() => {
      console.log("DB connection closed after migration")
    });
  }
}
