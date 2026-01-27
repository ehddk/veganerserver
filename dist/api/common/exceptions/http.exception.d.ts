declare class HttpException extends Error {
    statusCode: number;
    constructor(statusCode: number | undefined, data: string | {
        message: string;
        [key: string]: any;
    });
}
export default HttpException;
