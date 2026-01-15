import AppError from "./AppError.js";

class ExistingEntityError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

export default ExistingEntityError;