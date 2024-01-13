import { Elysia } from "elysia"

let startTime = 0

export const logger = new Elysia()
    .onBeforeHandle((request: Request | any) => {
        startTime = performance.now()
    })
    .onAfterHandle((request: Request | any) => {
        const endTime = performance.now()
        const timeDifferenceInSeconds = endTime - startTime
        const { method, url } = request?.request
        const log = new Date().toISOString() + ' ' + method + ' ' + new URL(url).pathname + ' ' + timeDifferenceInSeconds.toFixed(2) + 'ms '
        console.log(log)
    })