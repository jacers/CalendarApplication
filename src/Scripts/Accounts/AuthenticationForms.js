/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file performs authtication functions, such as registration, logging in, and signing out.
Notes: Connected to ../../..index.html
*/

import { auth, database, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut} from '../Firebase.js';
import { setDoc, doc } from 'firebase/firestore';
import { checkEmpty, checkPasswordRequirements} from './PasswordCheck.js';

// Sign Up with Email and Password
async function register(email, password, firstName, lastName) {
  
  // Getting the sections from the register 
  const emailField = document.getElementById("REmailAddress");
  const passwordField = document.getElementById("RPassword");
  const firstField = document.getElementById("RFirstName");
  const lastField = document.getElementById("RLastName");

  // Clear previous validity messages
  emailField.setCustomValidity("");
  passwordField.setCustomValidity("");
  firstField.setCustomValidity("");
  lastField.setCustomValidity("");

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

    console.log("User signed up and data stored:", userCredential.user);

  } catch (error) {

    // Just testing messages
    console.error("Error signing up:", error.message);

    // Displaying error code based on the error messages thrown
    switch (error.code || error.message) 
    {
      case "auth/email-already-in-use":
        emailField.setCustomValidity("This email address is already in use.");
        break;
      case "auth/invalid-email":
        emailField.setCustomValidity("The email address is not valid.");
        break;
      case "auth/missing-password":
        passwordField.setCustomValidity("Please fill in the password field");
        break;
      case "auth/requirements-not-met":
        passwordField.setCustomValidity("Please meet the password requirements.");
        break;
      case "auth/empty-first":
        firstField.setCustomValidity("Please fill in this field.");
        break;
      case "auth/empty-last":
        lastField.setCustomValidity("Please fill in this field.");
        break;
    }

    // Trigger form validation
    emailField.reportValidity();
    passwordField.reportValidity();
    lastField.reportValidity();
    firstField.reportValidity();
  }
}

// Sign In with Email and Password
async function loginWithEP(email, password) 
{
  try 
  {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in:', userCredential.user);
    window.location.href = "../../../public/Pages/CalendarPage.html"; // Or another page

  } catch (error) {
    console.error('Error signing in:', error.message);
  }
}

// Sign In with Google
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
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

// Logout function (Will be moved, just had to add it because i was stuck in logged in)
async function logout() {
  try {
    await signOut(auth);
    console.log('User signed out');
    
    // Redirect to the login page or home page after signing out
    window.location.href = "login.html"; // Or another page
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
}

// Logout button
document.getElementById("logoutButton").addEventListener("click", logout);