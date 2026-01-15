import AppError from "./AppError.js";

class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 422);
        this.details =details;
    }
}
export default ValidationError;