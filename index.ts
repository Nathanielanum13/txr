import { ApplicationHandler } from "./src/handlers"
import dbConnect, { runMigrations } from "./src/db/db"

// Start TXR application

// Declare global variables
const PORT = process.env.TXR_PORT || 3100

// Connect to Database and run latest migrations
const databaseConnection = await dbConnect()
runMigrations(databaseConnection)



Bun.serve({
    port: PORT,
    fetch(request) {
        const url = new URL(request.url)

        if (url.pathname === "/") {
            return new Response(JSON.stringify({
                alive: true,
                environment: process.env.TXR_ENVIRONMENT,
                version: process.env.TXR_APP_VERSION,
                application: "Task Runner Application",
                email: "nathanielanum13@gmail.com"
            }))
        }

        if (url.pathname === "/application") return ApplicationHandler(request)

        return new Response(null)
    }
})
console.log(`Server running on http://localhost:${PORT}`)