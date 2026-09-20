import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpAqAMv3GOAmafdPRegk2H31IRwJAY1sU",
  authDomain: "games-ffeed.firebaseapp.com",
  projectId: "games-ffeed",
  storageBucket: "games-ffeed.firebasestorage.app",
  messagingSenderId: "533699534413",
  appId: "1:533699534413:web:3cfcee3d8a77de1f4c4604"
};

const allowedEmails = new Set([
  "wiensshinji@gmail.com"
].map((email) => email.toLowerCase()));

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const authScreen = document.querySelector("#auth-screen");
const googleSignInButton = document.querySelector("#google-sign-in-button");
const formMessage = document.querySelector("#form-message");
const signOutButton = document.querySelector("#sign-out-button");
const protectedContent = document.querySelectorAll(".protected-content");

googleProvider.setCustomParameters({ prompt: "select_account" });

function isAllowed(user) {
  return Boolean(user.email && allowedEmails.has(user.email.toLowerCase()));
}

function showProtectedContent(show) {
  authScreen.hidden = show;
  protectedContent.forEach((element) => {
    element.hidden = !show;
  });
}

function setFormMessage(message) {
  formMessage.textContent = message;
}

setPersistence(auth, browserLocalPersistence).catch(() => {
  setFormMessage("This browser could not remember your sign-in.");
});

onAuthStateChanged(auth, async (user) => {
  if (user && isAllowed(user)) {
    setFormMessage("");
    showProtectedContent(true);
    return;
  }

  showProtectedContent(false);

  if (user) {
    await signOut(auth);
    setFormMessage("This account is not approved for access.");
  }
});

googleSignInButton.addEventListener("click", async () => {
  googleSignInButton.disabled = true;
  setFormMessage("Signing in...");

  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      setFormMessage("");
    } else {
      setFormMessage("Google sign-in failed. Please try again.");
    }
  } finally {
    googleSignInButton.disabled = false;
  }
});

signOutButton.addEventListener("click", () => signOut(auth));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}