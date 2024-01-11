import { Elysia } from "elysia"
import { validateHeader } from "../utils/helper"

export const ValidateTraceidMiddleware = new Elysia()
    .onBeforeHandle((request: Request | any) => {
        const validateTraceid = validateHeader(request.headers, "traceid", ["exist", "uuid"])
        if (!validateTraceid.isValid) return validateTraceid.results
    })

