export const HealthCheckHandler = () => {
    return new Response(JSON.stringify({
        alive: true,
        environment: process.env.TXR_ENVIRONMENT,
        version: process.env.TXR_APP_VERSION,
        application: "Task Runner Application",
        email: "nathanielanum13@gmail.com"
    }))
}