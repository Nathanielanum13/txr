import Ajv, { JSONSchemaType } from "ajv";
import { JobType } from "../types/JobType";
const ajv = new Ajv()

const createJobTypeSchema: JSONSchemaType<JobType[]> = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: { type: "string" },
            name: { type: "string" },
            options: { type: "object" },
            type: { type: "string", enum: ["CUSTOM_JOB_TYPE", "TXR_JOB_TYPE"] },
            created_at: { type: "string" },
            updated_at: { type: "string" },
            traceid: { type: "string" }
        },
        required: ["name", "options"],
        additionalProperties: false
    }
}

export const validateJobTypePayload = ajv.compile(createJobTypeSchema)