/**
 * Function to handle errors
 * @param {*} err_msg error message
 * logs error in server console
 * @throws new error with message
 */
export const handleError = (err_msg, error = {}) => {
    console.error(String(err_msg), error);
    throw new Error(err_msg);
}