import { Context } from "elysia"
import { CronJob } from 'cron';
import dbConnect from "../db/db"
import { modelErrorResponse, modelSuccessResponse } from "../utils/helper"
import { validateSequencePayload } from "../validation/sequence-validation-file"
import { v4 as uuidv4 } from "uuid"

export const SequenceHandler = async (ctx: Context): Promise<Response> => {
    const traceid = ctx.headers.traceid
    let response: Response = new Response()

    const dbConnection = await dbConnect()
    await dbConnection("sequence")
        .select("id", "app_id", "app_name", "description", "frequency", "created_at", "updated_at")
        .where("status", "!=", false)
        .then(async (dbResponse) => {
            let fullResponse = dbResponse
            // TODO Use advanced queries to acheive same result

            fullResponse = await Promise.all(
                dbResponse.map(async (data) => {
                  // Use await to wait for the inner promise to resolve
                  await dbConnection("job")
                    .select("id", "to", "type", "options")
                    .where("seq_id", "=", data?.id)
                    .then((jobResponse) => {
                      data.jobs = jobResponse;
                    });
              
                  return data;
                })
            );
        
            response = modelSuccessResponse({
                message: "sequence fetched successfully",
                code: 200,
                data: fullResponse,
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

export const CreateSequenceHandler = async (ctx: Context): Promise<Response> => {
    const payload = ctx.body
    const traceid = ctx.headers.traceid
    let response: Response = new Response()
    const dbConnection = await dbConnect()

    // Validate payload
    if (!validateSequencePayload(payload)) {
        return modelErrorResponse({
            code: 400,
            errors: validateSequencePayload.errors,
            message: "Invalid request object",
            traceid: traceid
        })
    }

    // [...payload.map(data => ({ ...data, id: uuidv4(), contact: JSON.stringify(data.contact), traceid: traceid }))]
    const dataToInsert = { ...payload, id: uuidv4(), traceid: traceid, status: false }

    // Fetch app name using app_id from payload
    await dbConnection("application").select("name").where("id", "=", payload?.app_id).then((dbResponse) => {
        dataToInsert.app_name = dbResponse[0]?.name
    }).catch((err) => {
        response = modelErrorResponse({
            message: "invalid app_id",
            code: 500,
            errors: [err],
            traceid: traceid
        })
    })


    const jobs = replacePlaceholdersWithUUIDs(dataToInsert?.jobs as any) || null
    delete dataToInsert?.jobs

    // Insert sequence data into sequence table
    await dbConnection("sequence").insert(dataToInsert, ["id"]).then(async (dbResponse) => {
        const sequenceId = dbResponse?.[0]?.id

        if (jobs === null || jobs?.length === 0) {
            response = modelSuccessResponse({
                message: "sequence created successfully",
                code: 200,
                data: dbResponse,
                traceid: traceid
            })
        } else {
            // Model request for creating job
            const jobsPayload = jobs?.map((job: any) => {
                if (job?.id === null || job?.id === "") {
                    job.id = uuidv4()
                }
                job.seq_id = sequenceId
                job.options = JSON.stringify(job?.options)
                job.traceid = traceid

                return job
            })

            // Create jobs now
            await dbConnection("job").insert(jobsPayload, ["id"]).then((db2Response) => {
                response = modelSuccessResponse({
                    message: "sequence created successfully",
                    code: 200,
                    data: {
                        "sequence": dbResponse,
                        "jobs": db2Response
                    },
                    traceid: traceid
                })
            })
            
        }
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

const replacePlaceholdersWithUUIDs = (data: []) => {
    const uuidMap = new Map();
  
    const replaceUUIDs = (obj: any) => {
      for (const key in obj) {
        if (obj[key] !== null && typeof obj[key] === 'object') {
          replaceUUIDs(obj[key]);
        } else if (typeof obj[key] === 'string' && obj[key].startsWith('~')) {
          const placeholder = obj[key];
          if (!uuidMap.has(placeholder)) {
            uuidMap.set(placeholder, uuidv4());
          }
          obj[key] = uuidMap.get(placeholder);
        }
      }
    };
  
    replaceUUIDs(data);
  
    return data;
}

export const ActivateSequenceHandler = async (ctx: Context | any): Promise<Response> => {
    const traceid = ctx.headers.traceid
    const id = ctx.params.id
    const dbConnection = await dbConnect()
    let response: Response = new Response()

    await dbConnection("sequence").where({ id: id }).update({ status: true }, ["id", "frequency"]).then(async (dbResponse) => {
        // 1. Fetch all jobs in this sequence
        const runJob = async () => {
            let computedJobs: any = []
            try {
                const db2Response = await dbConnection("job").select("*").where("seq_id", "=", id);

                console.log(db2Response, 'Hi')

                if (db2Response?.length) {
                    computedJobs = await Promise.all(
                        db2Response.map(async (job) => {
                            const db3Response = await dbConnection("job_type").select("*").where("id", "=", job?.type);
                            let runner: any = {}
                            const plugin = db3Response?.[0]?.name;
        
                            const pluginModule = await import(`../plugins/${plugin}.ts`);
                            const pluginFunction = pluginModule?.default;
        
                            runner.job = () => pluginFunction?.(db3Response?.[0]?.options, job);

                            return runner
                        })
                    );
                } else {
                    response = modelSuccessResponse({
                        message: "sequence activated successfully",
                        code: 200,
                        data: dbResponse,
                        traceid: traceid
                    })
                }
            } catch (err) {
                response = modelErrorResponse({
                    message: "Error while running jobs",
                    code: 500,
                    errors: [err],
                    traceid: traceid,
                });
            }

            return computedJobs
        };

        const result = await runJob()
        
        const job = new CronJob(
            dbResponse?.[0]?.frequency,
            function() {
                result.forEach((runner: any) => {
                    runner.job()
                })
            }
        );
        
        job.start();
        

        response = modelSuccessResponse({
            message: "sequence activated successfully",
            code: 200,
            data: dbResponse,
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

// export const UpdateApplicationHandler = async (ctx: Context | any): Promise<Response> => {
//     const payload = ctx.body
//     const traceid = ctx.headers.traceid
//     const id = ctx.params.id

//     let response: Response = new Response()

//     // Validate payload
//     if (!validateApplicationPayload(payload)) {
//         return modelErrorResponse({
//             code: 400,
//             errors: validateApplicationPayload.errors,
//             message: "Invalid request object",
//             traceid: traceid
//         })
//     }

//     const dataToInsert = [...payload.map(data => ({ ...data, contact: JSON.stringify(data.contact) }))]

//     const dbConnection = await dbConnect()
//     await dbConnection("application").where({ id: id }).update(dataToInsert[0], ["id", "name"]).then((insertResponse) => {
//         response = modelSuccessResponse({
//             message: "application updated successfully",
//             code: 200,
//             data: insertResponse,
//             traceid: traceid
//         })
//     }).catch((err) => {
//         response = modelErrorResponse({
//             message: "internal server error",
//             code: 500,
//             errors: [err],
//             traceid: traceid
//         })
//     }).finally(() => {
//         dbConnection.destroy()
//     })

//     return response
// }

// export const DeleteApplicationHandler = async (ctx: Context | any): Promise<Response> => {
//     const traceid = ctx.headers.traceid
//     const id = ctx.params.id

//     let response: Response = new Response()

//     const dbConnection = await dbConnect()
//     await dbConnection("application").where({ id: id }).update({ status: false }, ["id", "name"]).then((insertResponse) => {
//         response = modelSuccessResponse({
//             message: "application deleted successfully",
//             code: 200,
//             data: insertResponse,
//             traceid: traceid
//         })
//     }).catch((err) => {
//         response = modelErrorResponse({
//             message: "internal server error",
//             code: 500,
//             errors: [err],
//             traceid: traceid
//         })
//     }).finally(() => {
//         dbConnection.destroy()
//     })

//     return response
// }