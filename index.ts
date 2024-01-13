import dbConnect, { runMigrations } from "./src/db/db"
import { Elysia } from "elysia"
import router from "./src/router/router"
import { logger } from "./src/middleware/logger"

// Start TXR application

// Declare global variables
const PORT = process.env.TXR_PORT || 3100

// Connect to Database and run latest migrations
const databaseConnection = await dbConnect()
runMigrations(databaseConnection)


new Elysia()
    .use(logger)
    .use(router)
    .listen(PORT)

console.log(`Server running on http://localhost:${PORT}`)