import AppError from "./AppError.js";

class AuthenticationError extends appError {
    constructor(message) {
        super(message, 401);
    }
}
export default AuthenticationError;