import dbConnect from "../db/db"
import { modelErrorResponse, modelSuccessResponse, validateHeader } from "../utils/helper"
import { validateCreateApplicationPayload } from "../validation/application-validation-file"
import { v4 as uuidv4 } from "uuid"

export const ApplicationHandler = async (request: Request): Promise<Response> => {
    if (request.method === "GET") {
        const headers = request.headers
        let response: Response = new Response()

        // Validate headers
        const validateTraceid = validateHeader(headers, "traceid", ["exist", "uuid"])
        if (!validateTraceid.isValid) return validateTraceid.results

        const dbConnection = await dbConnect()
        await dbConnection("application").select("id", "name", "contact", "created_at", "updated_at").then((insertResponse) => {
            response = modelSuccessResponse({
                message: "application fetched successfully",
                code: 200,
                data: insertResponse,
                traceid: validateTraceid.value
            })
        }).catch((err) => {
            response = modelErrorResponse({
                message: "internal server error",
                code: 500,
                errors: err,
                traceid: validateTraceid.value
            })
        }).finally(() => {
            dbConnection.destroy()
        })
        
        return response
    }

    if (request.method === "POST") {
        const payload = await request.json()
        const headers = request.headers
        let response: Response = new Response()

        // Validate headers
        const validateTraceid = validateHeader(headers, "traceid", ["exist", "uuid"])
        if (!validateTraceid.isValid) return validateTraceid.results

        // Validate payload
        if (!validateCreateApplicationPayload(payload)) {
            return modelErrorResponse({
                code: 400,
                errors: validateCreateApplicationPayload.errors,
                message: "Invalid request object",
                traceid: validateTraceid.value
            })
        }

        const dataToInsert = [...payload.map(data => ({ ...data, id: uuidv4(), contact: JSON.stringify(data.contact), traceid: headers.get("traceid") }))]

        const dbConnection = await dbConnect()
        await dbConnection("application").insert(dataToInsert, ["id", "name"]).then((insertResponse) => {
            response = modelSuccessResponse({
                message: "application created successfully",
                code: 200,
                data: insertResponse,
                traceid: validateTraceid.value
            })
        }).catch((err) => {
            response = modelErrorResponse({
                message: "internal server error",
                code: 500,
                errors: err,
                traceid: validateTraceid.value
            })
        }).finally(() => {
            dbConnection.destroy()
        })


        return response
    }

    return new Response()
}