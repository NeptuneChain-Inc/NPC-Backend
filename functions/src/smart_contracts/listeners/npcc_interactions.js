const { getNeptuneChainCreditsInteractions } =  require('../interactions/npcCredits');
const { fdb } =  require('../../apis/firebase'); 

var interactions;

const startListeners =  async (signer) => {
  interactions = getNeptuneChainCreditsInteractions(signer);

  // Listen for CreditsIssued event
  interactions.Listeners.onCreditsIssued(async (eventData) => {
    try {
      await addDoc(collection(fdb, "creditsIssued"), eventData);
      console.log("CreditsIssued event saved to Firebase:", eventData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  // Listen for CreditsBought event
  interactions.Listeners.onCreditsBought(async (eventData) => {
    try {
      await addDoc(collection(fdb, "creditsBought"), eventData);
      console.log("CreditsBought event saved to Firebase:", eventData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  // Repeat similar setup for other listeners
  interactions.Listeners.onCreditsTransferred(async (eventData) => {
    try {
      await addDoc(collection(fdb, "creditsTransferred"), eventData);
      console.log("CreditsTransferred event saved to Firebase:", eventData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  interactions.Listeners.onCreditsDonated(async (eventData) => {
    try {
      await addDoc(collection(fdb, "creditsDonated"), eventData);
      console.log("CreditsDonated event saved to Firebase:", eventData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  interactions.Listeners.onCertificateCreated(async (eventData) => {
    try {
      await addDoc(collection(fdb, "certificatesCreated"), eventData);
      console.log("CertificateCreated event saved to Firebase:", eventData);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });

  return true;
};

const stopListeners = () => {
  if (interactions) {
    interactions.Listeners.removeAllListeners();
    console.log('Event listeners stopped');
    return "Stopped listening to events";
  } else {
    console.log('No active listeners to stop');
    return "No listeners were active";
  }
};


module.exports = { startListeners, stopListeners };
