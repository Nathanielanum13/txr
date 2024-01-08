import Ajv, { JSONSchemaType } from "ajv";
import { Application } from "../types/Application";
const ajv = new Ajv()

const createApplicationSchema: JSONSchemaType<Application[]> = {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: { type: "string" },
            name: { type: "string" },
            contact: { 
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        phone: { type: "string", pattern: "^[0-9]{12}$" },
                        name: { type: "string" },
                        type: { type: "string", enum: ["PRIMARY", "SECONDARY", "TECHNICAL"] }
                    },
                    required: ["email", "phone", "type", "name"],
                    additionalProperties: false,
                },
            },
            created_at: { type: "string" },
            updated_at: { type: "string" }
        },
        required: ["name", "contact"],
        additionalProperties: false
    }
}

export const validateCreateApplicationPayload = ajv.compile(createApplicationSchema)