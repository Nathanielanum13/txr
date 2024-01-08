import dbConnect from "../db/db"
import { validateCreateApplicationPayload } from "../validation/application-validation-file"
import { v4 as uuidv4 } from "uuid"

export const ApplicationHandler = async (request: Request): Promise<Response> => {
    if (request.method === "GET") {
        return new Response(JSON.stringify([]))
    }

    if (request.method === "POST") {
        const payload = await request.json()

        if (!validateCreateApplicationPayload(payload)) {
            const response = new Response(JSON.stringify(validateCreateApplicationPayload.errors))
            response.headers.append("Content-Type", "application/json")

            return response
        }

        const dataToInsert = [...payload.map(data => ({ ...data, id: uuidv4() }))]

        console.log(JSON.stringify(dataToInsert))

        const dbConnection = await dbConnect()
        dbConnection.insert(
            JSON.stringify(dataToInsert),
            ["id"]
        ).into("application").then((insertResponse) => {
            console.log(insertResponse)
        }).finally(() => {
            dbConnection.destroy()
        })


        return new Response("Application created successfully")
    }

    return new Response()
}