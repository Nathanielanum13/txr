import knex from "knex";
export default async (expectedOptions: any, job: any, prevJobData: any, successCallback: (data: any) => void) => {
    const providedOptions = job?.options
    let clients: string[] = expectedOptions?.client?.split("|")
    clients = clients.map((client: string) => {
        client = client.trim()
        client = client.replaceAll("\'", "")
        return client
    })

    if (!clients.includes(providedOptions?.client)) {
        console.error(`Failed to execute job ${job?.id}. Reason: Invalid option client provided`)
        return
    }

    if (providedOptions?.database !== "" && providedOptions?.user !== "" && providedOptions?.password !== "") {
        const knexConfig = {
            client: providedOptions?.client,
            connection: {
              connectionString: providedOptions?.connection_string,
              host: providedOptions?.host,
              port: providedOptions?.port,
              database: providedOptions?.database,
              user: providedOptions?.user,
              password: providedOptions?.password,
              ssl: providedOptions?.password ? { rejectUnauthorized: false } : false,
            },
            pool: {
              min: 2,
              max: 10,
            },
            migrations: {
              tableName: "knex_migrations",
            },
        }

        const databaseConnection = knex(knexConfig);

        let data: any
        await databaseConnection.raw(providedOptions?.query).then((results: any) => {
            data = JSON.stringify(results?.rows)
            successCallback(data)
        }).finally(() => {
            databaseConnection.destroy()
        })
    }


}