import { Response } from "express";


interface IRequestData<T>{
    httpStatusCode:number;
    success:boolean;
    message:string;
    data?:T;
}

export const sendResponse=<T>(res: Response, data: IRequestData<T>) => {
    const { httpStatusCode, success, message, data: responseData } = data;
    res.status(httpStatusCode).json({
        success,
        message,
        data: responseData
    });
}