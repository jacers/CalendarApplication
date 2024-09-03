import { auth, database, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut} from '../Firebase.js';
import { setDoc, doc } from 'firebase/firestore';

// Sign Up with Email and Password
async function register(email, password, firstName, lastName) {
  // Getting the emailAddress section
  const emailField = document.getElementById("REmailAddress");

  // Clear previous validity messages
  emailField.setCustomValidity("");

  // Checking and trying to create an account
  try {
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
    console.error('Error signing up:', error.message);

    // Displaying error code based on the error messages thrown
    switch (error.code) 
    {
      case 'auth/email-already-in-use':
        emailField.setCustomValidity('This email address is already in use.');
        break;
      case 'auth/invalid-email':
        emailField.setCustomValidity('The email address is not valid.');
        break;
    }

    // Trigger form validation
    emailField.reportValidity();
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
