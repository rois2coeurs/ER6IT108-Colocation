import {SafeDisplayError} from "./SafeDisplayError.ts";

export class UnauthorizedError extends SafeDisplayError {
    constructor(message: string = "Unauthorized") {
        super(message, 401);
    }
}