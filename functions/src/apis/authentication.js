const { auth } = require("./firebase");
const {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { UserDB } = require("./database");
const { isValidEmail } = require("../scripts/validators");

/**
 * Creates a user with email and password authentication.
 * 
 * @param {Object} params - The parameters for creating the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.username - The username of the user.
 * @param {string} params.type - The type of the user.
 * @param {string} params.password - The password of the user.
 * @returns {Promise<Object|null>} - A promise that resolves to the created user object or null if the email is invalid.
 * @throws {Error} - If there is an error during the user creation process.
 */
const createEmailUser = async ({ email, username, type, password }) => {
  if (isValidEmail(email)) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential || {};
  
      if (user) {
        const { uid } = user;
        return await UserDB.set.create({
          uid,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          type,
        });
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  return null;
};

/**
 * Sign in a user using email and password.
 *
 * @param {Object} params - The parameters for signing in the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.password - The password of the user.
 * @returns {string|null} - The UID of the signed-in user, or null if the email is invalid.
 * @throws {Error} - If there is an error during the sign-in process.
 */
const signEmailUser = async ({ email, password }) => {
  if (isValidEmail(email)) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password) || {};
      return user?.uid
    } catch (error) {
      console.error(e)
      throw(e)
    }
  }
  return null;
};

/**
 * Handles the reset password functionality.
 *
 * @param {string} email - The email address of the user.
 * @returns {boolean|null} - Returns true if the password reset email is sent successfully, null otherwise.
 * @throws {Error} - Throws an error if there is an issue sending the password reset email.
 */
const handleResetPassword = async (email) => {
  if (isValidEmail(email)) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true
    } catch (e) {
      console.error(e)
      throw e
    }
  }
  return null;
};

const EmailUser = {
  create: createEmailUser,
  sign: signEmailUser,
  reset_password: handleResetPassword
}

module.exports = { EmailUser };
