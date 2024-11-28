import { ErrorProps } from "@/types/Types";

export function handleResponse(message:string, error:boolean, payload?:object, code?:number):ErrorProps{
    const data:ErrorProps  = {
        message, error, payload, code
    } 
    return JSON.parse(JSON.stringify(data))
}