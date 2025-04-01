
/**
 * Description placeholder
 *
 * @export
 * @class CustomError
 * @typedef {CustomError}
 * @extends {Error}
 */
export class CustomError extends Error {
    
    /**
     * Creates an instance of CustomError.
     *
     * @constructor
     * @param {{ message?: string; status?: number; }} param0 
     * @param {string} [param0.message=''] 
     * @param {number} [param0.status=500] 
     * @throws {TypeError} if status parameter is not a number
     */
    constructor({message, status=500}) {
        super(message); // فراخوانی constructor کلاس والد (Error)
        this.status = status; // اضافه کردن فیلد status
    }
}
