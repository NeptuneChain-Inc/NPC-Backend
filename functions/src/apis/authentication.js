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
        return (await UserDB.create.user({
          uid,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          type,
        }))
          ? user
          : null;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  return null;
};

/** TO-DO: TEST */
const getUserFromEmail = async (email) => {
  auth
    .getUserByEmail(email)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      return userRecord;
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
};

/** TO-DO: TEST */
const getUserFromUID = async (userUID) => {
  auth
    .getUser(userUID)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      return userRecord;
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
};

const isUserEmailVerified = async (userUID) => {
  const userRecord = await getUserFromUID(userUID);
  return userRecord?.isEmailVerified();
};

const handleResetPassword = async ({ email }) => {
  if (isValidEmail(email)) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  return null;
};

const EmailUser = {
  create: createEmailUser,
  getUser: {
    fromUID: getUserFromUID,
    fromEmail: getUserFromEmail,
  },
  isVerified: isUserEmailVerified,
  reset_password: handleResetPassword,
};

module.exports = { EmailUser };
