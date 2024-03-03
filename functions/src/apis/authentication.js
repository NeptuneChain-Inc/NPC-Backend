const { auth } = require("./firebase");
const {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("firebase/auth");
const { UserDB } = require("./database");
const { isValidEmail } = require("../scripts/validators");


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
        }) ? user : null;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  return null;
};

const handleResetPassword = async ({email}) => {
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
  reset_password: handleResetPassword
}

module.exports = { EmailUser };
