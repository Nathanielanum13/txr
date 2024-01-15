import { TResponse } from "../types/TResponse"
import { v4 as uuidv4 } from "uuid"

export const modelErrorResponse = (errorObject: { message: string, code: number, errors: any, traceid?: string }): Response => {
    const currentDate = new Date();
    const currentTimestampISO = currentDate.toISOString();

    let responseBody: TResponse = {
        data: {
            data: [],
            errors: errorObject.errors,
            message: errorObject.message,
            status: "ERROR",
            code: errorObject.code
        },
        meta: {
            timestamp: currentTimestampISO,
            traceid: errorObject?.traceid || uuidv4()
        }
    };


    const response = new Response(JSON.stringify(responseBody), {
        headers: { "Content-Type": "application/json" },
        status: errorObject.code
    })

    return response 
}

export const modelSuccessResponse = (successObject: { message: string, code: number, data: any, traceid?: string }): Response => {
    const currentDate = new Date();
    const currentTimestampISO = currentDate.toISOString();

    let responseBody: TResponse = {
        data: {
            data: successObject.data,
            errors: [],
            message: successObject.message,
            status: "SUCCESS",
            code: successObject.code
        },
        meta: {
            timestamp: currentTimestampISO,
            traceid: successObject?.traceid || uuidv4()
        }
    };


    const response = new Response(JSON.stringify(responseBody), {
        headers: { "Content-Type": "application/json" },
        status: successObject.code
    })

    return response 
}

export const validateHeader = (headers: any, field: string, validation: string[]) => {
    validation = validation?.length ? validation : ["exist"]
    let errors: any = []
    let isValid = true
    const fieldValue = headers?.[field]

    if (validation.includes("exist")) {
        if (!headers?.[field]) {
            errors = [...errors, {
                message: "Missing header: " + field
            }]
            isValid = isValid && false
        }
    }

    if (validation.includes("uuid")) {
        if (!isValidUUIDv4(fieldValue)) {
            errors = [...errors, {
                message: "Invalid uuid: " + field
            }]
            isValid = isValid && false
        }
    }

    return {
        isValid,
        value: fieldValue,
        results: modelErrorResponse({
            code: 400,
            errors: errors,
            message: "Invalid request header",
            traceid: headers?.["traceid"]
        })
    }

}

export const isValidUUIDv4 = (uuid: string) => {
    const uuidv4Pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidv4Pattern.test(uuid);
}

export const orderJobs = (arr: any[]) => {
    const graph: any = {};
    const inDegree: any = {};
  
    // Build the graph and in-degree map
    arr.forEach((item) => {
      const id = item.id;
      const to = item.to;
  
      if (!graph[id]) {
        graph[id] = [];
        inDegree[id] = 0;
      }
  
      if (to && !graph[to]) {
        graph[to] = [];
        inDegree[to] = 0;
      }
  
      if (to) {
        graph[id].push(to);
        inDegree[to]++;
      }
    });
  
    // Perform topological sort
    const result = [];
    const queue: any = [];
  
    // Enqueue nodes with in-degree 0
    Object.keys(inDegree).forEach((node) => {
      if (inDegree[node] === 0) {
        queue.push(node);
      }
    });
  
    while (queue.length > 0) {
      const currentNode = queue.shift();
      result.push(arr.find((item) => item.id === currentNode));
  
      graph[currentNode].forEach((neighbor: any) => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      });
    }
  
    // Check for cycles
    if (result.length !== arr.length) {
      console.error('Error: The given array contains a cycle.');
      return arr;
    }
  
    return result;
}
  