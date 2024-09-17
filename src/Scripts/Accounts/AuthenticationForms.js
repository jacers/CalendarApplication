/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file performs authtication functions, such as registration and loggin in.
Notes: Connected to ../../..index.html
*/

import { auth, database, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut} from '../Firebase.js';
import { setDoc, doc } from 'firebase/firestore';
import { checkEmpty, checkPasswordRequirements} from './PasswordCheck.js';

// Sign Up with Email and Password
async function register(email, password, firstName, lastName) {
  
  // Getting the sections from the register 
  const emailFieldR = document.getElementById("REmailAddress");
  const passwordFieldR = document.getElementById("RPassword");
  const firstFieldR = document.getElementById("RFirstName");
  const lastFieldR = document.getElementById("RLastName");

  // Clear previous validity messages
  emailFieldR.setCustomValidity("");
  passwordFieldR.setCustomValidity("");
  firstFieldR.setCustomValidity("");
  lastFieldR.setCustomValidity("");

  // Checking and trying to create an account
  try {

    // Checking to see if password meets the requirements
    if(!checkPasswordRequirements(password))
    {
      throw new Error("auth/requirements-not-met");
    }

    // Checking to see if first name or last name is empty
    if(checkEmpty(firstName))
    {
      throw new Error("auth/empty-first");
    }
    else if(checkEmpty(lastName))
    {
      throw new Error("auth/empty-last");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user information in Firestore
    await setDoc(doc(database, "Users", user.uid), 
    {
      EmailAddress: user.email,
      FirstName: firstName,
      LastName: lastName
    }); 

    // THIS IS TEMPORARY AS THIS IS BEING USED TO CHECK FOR ERRORS AND CONFIRM ITS WORKING
    console.log("User signed up and data stored:", userCredential.user);

    // Redirect user to the login window
    window.location.href = "../../index.html";

  } catch (error) {

    // Just testing messages
    console.error("Error signing up:", error.message);

    // Displaying error code based on the error messages thrown
    switch (error.code || error.message) 
    {
      case "auth/email-already-in-use":
        emailFieldR.setCustomValidity("This email address is already in use.");
        break;
      case "auth/missing-password":
        passwordFieldR.setCustomValidity("Please fill in this field.");
        break;
      case "auth/requirements-not-met":
        passwordFieldR.setCustomValidity("Please meet the password requirements.");
        break;
      case "auth/empty-first":
        firstFieldR.setCustomValidity("Please fill in this field.");
        break;
      case "auth/empty-last":
        lastFieldR.setCustomValidity("Please fill in this field.");
        break;
    }

    // Trigger form validation
    emailFieldR.reportValidity();
    passwordFieldR.reportValidity();
    lastFieldR.reportValidity();
    firstFieldR.reportValidity();
  }
}

// Sign In with Email and Password
async function loginWithEP(email, password) 
{
  // Getting the required fields to display errors
  const emailFieldL = document.getElementById("LEmailAddress");
  const passwordFieldL = document.getElementById("LPassword");

  // Clearing any previous validation messages
  emailFieldL.setCustomValidity("");
  passwordFieldL.setCustomValidity("");

  try 
  {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
    window.location.href = "../../../public/Pages/CalendarPage.html"; // Or another page

  } catch (error) {

    // Error message for console
    console.error('Error signing in:', error.message);

    switch(error.code || error.message)
    {
      case "auth/invalid-email":
        emailFieldL.setCustomValidity("Please input valid email.")
        break;
      case "auth/missing-password":
        passwordFieldL.setCustomValidity("Please fill in this field.")
        break;
      case "auth/invalid-credential":
        passwordFieldL.setCustomValidity("The provided email or password is incorrect.")
        break;
      case "auth/too-many-requests":
        // This is temporary before I set up the message to appear on the login page
        alert("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.");
        break;
    }

    // Trigger validaition
    emailFieldL.reportValidity();
    passwordFieldL.reportValidity();
  }
}

// Sign In with Google
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    // ALSO TEMP
    console.log('User signed in with Google:', result.user);
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
  }
}


// Event Listeners
// Registration Listener
document.getElementById("RegisterButton").addEventListener("click", () => {
  const email = document.getElementById("REmailAddress").value;
  const password = document.getElementById("RPassword").value;
  const firstName = document.getElementById("RFirstName").value;
  const lastName = document.getElementById("RLastName").value;
  register(email, password, firstName, lastName);
});

// Login Listener
document.getElementById("LoginButton").addEventListener("click", () => {
  const email = document.getElementById("LEmailAddress").value;
  const password = document.getElementById("LPassword").value;
  loginWithEP(email, password);
});


document.getElementById("googleSignInButton").addEventListener("click", () => {
  // This does an auto signin after user has already signed in once
  signInWithGoogle();
});