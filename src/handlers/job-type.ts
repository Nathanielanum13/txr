import { Context } from "elysia"
import dbConnect from "../db/db"
import { modelErrorResponse, modelSuccessResponse } from "../utils/helper"
import { validateJobTypePayload } from "../validation/job-type-validation-file"
import { v4 as uuidv4 } from "uuid"
import { JobTypeType } from "../types/JobType"

const jobTypeType: JobTypeType = "TXR_JOB_TYPE"

export const JobTypeHandler = async (ctx: Context): Promise<Response> => {
    const traceid = ctx.headers.traceid
    let response: Response = new Response()

    const dbConnection = await dbConnect()
    await dbConnection("job_type").select("id", "name", "type", "options", "created_at", "updated_at").where("status", "!=", false).then((insertResponse) => {
        response = modelSuccessResponse({
            message: "job types fetched successfully",
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

export const CreateJobTypeHandler = async (ctx: Context): Promise<Response> => {
    const payload = ctx.body
    const traceid = ctx.headers.traceid
    let response: Response = new Response()

    // Validate payload
    if (!validateJobTypePayload(payload)) {
        return modelErrorResponse({
            code: 400,
            errors: validateJobTypePayload.errors,
            message: "Invalid request object",
            traceid: traceid
        })
    }

    const dataToInsert = [...payload.map(data => ({ ...data, id: uuidv4(), options: JSON.stringify(data.options), traceid: traceid, type: jobTypeType }))]

    const dbConnection = await dbConnect()
    await dbConnection("job_type").insert(dataToInsert, ["id", "name"]).then((insertResponse) => {
        response = modelSuccessResponse({
            message: "job type created successfully",
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

export const UpdateJobTypeHandler = async (ctx: Context | any): Promise<Response> => {
    const payload = ctx.body
    const traceid = ctx.headers.traceid
    const id = ctx.params.id

    let response: Response = new Response()

    // Validate payload
    if (!validateJobTypePayload(payload)) {
        return modelErrorResponse({
            code: 400,
            errors: validateJobTypePayload.errors,
            message: "Invalid request object",
            traceid: traceid
        })
    }

    const dataToInsert = [...payload.map(data => ({ ...data, options: JSON.stringify(data.options), type: jobTypeType }))]

    const dbConnection = await dbConnect()
    await dbConnection("job_type").where({ id: id }).update(dataToInsert[0], ["id", "name"]).then((insertResponse) => {
        response = modelSuccessResponse({
            message: "job type updated successfully",
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

export const DeleteJobTypeHandler = async (ctx: Context | any): Promise<Response> => {
    const traceid = ctx.headers.traceid
    const id = ctx.params.id

    let response: Response = new Response()

    const dbConnection = await dbConnect()
    await dbConnection("job_type").where({ id: id }).update({ status: false }, ["id", "name"]).then((insertResponse) => {
        response = modelSuccessResponse({
            message: "job type deleted successfully",
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