import { Context } from "elysia"
import dbConnect from "../db/db"
import { modelErrorResponse, modelSuccessResponse, validateHeader } from "../utils/helper"
import { validateApplicationPayload } from "../validation/application-validation-file"
import { v4 as uuidv4 } from "uuid"

export const ApplicationHandler = async (ctx: Context): Promise<Response> => {
    const traceid = ctx.headers.traceid
    let response: Response = new Response()

    const dbConnection = await dbConnect()
    await dbConnection("application").select("id", "name", "contact", "created_at", "updated_at").then((insertResponse) => {
        response = modelSuccessResponse({
            message: "application fetched successfully",
            code: 200,
            data: insertResponse,
            traceid: traceid
        })
    }).catch((err) => {
        response = modelErrorResponse({
            message: "internal server error",
            code: 500,
            errors: [err],
            traceid: traceid
        })
    }).finally(() => {
        dbConnection.destroy()
    })

    return response
}

export const CreateApplicationHandler = async (ctx: Context): Promise<Response> => {
    const payload = ctx.body
    const traceid = ctx.headers.traceid
    let response: Response = new Response()

    // Validate payload
    if (!validateApplicationPayload(payload)) {
        return modelErrorResponse({
            code: 400,
            errors: validateApplicationPayload.errors,
            message: "Invalid request object",
            traceid: traceid
        })
    }

    const dataToInsert = [...payload.map(data => ({ ...data, id: uuidv4(), contact: JSON.stringify(data.contact), traceid: traceid }))]

    const dbConnection = await dbConnect()
    await dbConnection("application").insert(dataToInsert, ["id", "name"]).then((insertResponse) => {
        response = modelSuccessResponse({
            message: "application created successfully",
            code: 200,
            data: insertResponse,
            traceid: traceid
        })
    }).catch((err) => {
        response = modelErrorResponse({
            message: "internal server error",
            code: 500,
            errors: [err],
            traceid: traceid
        })
    }).finally(() => {
        dbConnection.destroy()
    })

    return response
}

export const UpdateApplicationHandler = async (ctx: Context | any): Promise<Response> => {
    const payload = ctx.body
    const traceid = ctx.headers.traceid
    const id = ctx.params.id

    let response: Response = new Response()

    // Validate payload
    if (!validateApplicationPayload(payload)) {
        return modelErrorResponse({
            code: 400,
            errors: validateApplicationPayload.errors,
            message: "Invalid request object",
            traceid: traceid
        })
    }

    const dataToInsert = [...payload.map(data => ({ ...data, contact: JSON.stringify(data.contact) }))]

    const dbConnection = await dbConnect()
    await dbConnection("application").where({ id: id }).update(dataToInsert[0], ["id", "name"]).then((insertResponse) => {
        response = modelSuccessResponse({
            message: "application updated successfully",
            code: 200,
            data: insertResponse,
            traceid: traceid
        })
    }).catch((err) => {
        response = modelErrorResponse({
            message: "internal server error",
            code: 500,
            errors: [err],
            traceid: traceid
        })
    }).finally(() => {
        dbConnection.destroy()
    })

    return response
}

export const DeleteApplicationHandler = async (ctx: Context | any): Promise<Response> => {
    const payload = ctx.body
    const traceid = ctx.headers.traceid
    const id = ctx.params.id

    let response: Response = new Response()

    // Validate payload
    if (!validateApplicationPayload(payload)) {
        return modelErrorResponse({
            code: 400,
            errors: validateApplicationPayload.errors,
            message: "Invalid request object",
            traceid: traceid
        })
    }

    const dataToInsert = [...payload.map(data => ({ ...data, contact: JSON.stringify(data.contact) }))]

    const dbConnection = await dbConnect()
    await dbConnection("application").where({ id: id }).update(dataToInsert[0], ["id", "name"]).then((insertResponse) => {
        response = modelSuccessResponse({
            message: "application updated successfully",
            code: 200,
            data: insertResponse,
            traceid: traceid
        })
    }).catch((err) => {
        response = modelErrorResponse({
            message: "internal server error",
            code: 500,
            errors: [err],
            traceid: traceid
        })
    }).finally(() => {
        dbConnection.destroy()
    })

    return response
}