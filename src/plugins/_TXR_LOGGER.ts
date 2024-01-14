const fs = require('fs').promises;
const path = require('path');

export default async (expectedOptions: any, job: any) => {
    const providedOptions = job?.options
    let types: string[] = expectedOptions?.type?.split("|")
    types = types.map((type: string) => {
        type = type.trim()
        type = type.replaceAll("\'", "")
        return type
    })

    if (!types.includes(providedOptions?.type)) {
        console.error(`Failed to execute job ${job?.id}. Reason: Invalid option type provided`)
    } else {
        if (providedOptions?.type === "STDOUT") {
            console.log(`Job ${job?.id} execution successful: ${providedOptions?.value}`)
        }

        if (providedOptions?.type === "FILE") {
            const filePath = providedOptions?.path;

            // Check if the file exists
            const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

            if (!fileExists) {
                // If the file doesn't exist, create it with the specified content
                await createFile(filePath, `${new Date().toISOString()} Job ${job?.id} execution successful: ${providedOptions?.value}`);
            } else {
                // If the file exists, append the content to it
                await appendToFile(filePath, `${new Date().toISOString()} Job ${job?.id} execution successful: ${providedOptions?.value}`);
            }

            console.log(`Job ${job?.id} execution successful: logs written to ${filePath}`);
        }
    }
}

export const createFile = async (filePath: string, content: any) => {
    try {
        // Ensure the directory structure exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        // Create the file with the specified content
        await fs.writeFile(filePath, content);
    } catch (error: any) {
        console.error(`Error creating file: ${error.message}`);
    }
};

export const appendToFile = async (filePath: string, content: any) => {
    try {
        // Append the content to the existing file
        await fs.appendFile(filePath, `\n${content}`);
    } catch (error: any) {
        console.error(`Error appending to file: ${error.message}`);
    }
};
