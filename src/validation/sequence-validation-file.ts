import Ajv, { JSONSchemaType } from "ajv";
import { Sequence } from "../types/Sequence";
const ajv = new Ajv()

const createSequenceSchema: JSONSchemaType<Sequence> = {
    type: "object",
    properties: {
        id: { type: "string" },
        app_id: { type: "string" },
        frequency: { type: "string" },
        description: { type: "string" },
        jobs: { 
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    to: { type: "string" },
                    seq_id: { type: "string" },
                    options: { type: "object" },
                    type: { type: "string" },
                    created_at: { type: "string" },
                    updated_at: { type: "string" },
                    traceid: { type: "string" }
                },
                required: ["type", "options"],
                additionalProperties: false
            }
        },
        created_at: { type: "string" },
        updated_at: { type: "string" },
        traceid: { type: "string" }
    },
    required: ["app_id", "frequency"],
    additionalProperties: false
}

export const validateSequencePayload = ajv.compile(createSequenceSchema)