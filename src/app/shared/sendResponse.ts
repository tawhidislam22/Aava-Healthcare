import { Response } from "express";


interface IRequestData<T>{
    httpStatusCode:number;
    success:boolean;
    message:string;
    data?:T;
    meta?:{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

export const sendResponse=<T>(res: Response, data: IRequestData<T>) => {
    const { httpStatusCode, success, message, data: responseData,meta } = data;
    res.status(httpStatusCode).json({
        success,
        message,
        data: responseData,
        meta
    });
}