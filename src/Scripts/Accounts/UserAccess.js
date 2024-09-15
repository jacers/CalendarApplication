/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file will restrict some sections/pages according to user authentication (Whether they are logged in or logged out)
Notes: Connected to ../../../index.html
*/

// Import Firebase Authentication
import { auth, onAuthStateChanged, signOut } from "../Firebase.js";

// Get reference to the auth link in the dropdown
const authLink = document.getElementById("AuthenticationLink");

// Function to update the dropdown menu based on the user's login state
onAuthStateChanged(auth, (user) => {

    // Loop to check if there is a user
    if (user) {
        // If the user is logged in, display "Logout" and add a logout functionality
        AuthenticationLink.textContent = "Logout";

         // `#` because it will be handled through JavaScript
         AuthenticationLink.href = "#";

        // Click listender
        AuthenticationLink.onclick = () => {

            // Log user out
            signOut(auth).then(() => {

                // Print message showing logged out
                console.log("User signed out");

                // Redirect them to the login page
                window.location.href = '../../index.html'; // Redirect after logout
            }).catch((error) => {
                console.error('Error during logout:', error);
            });
        };
    } else {
        // If the user is not logged in, display "Login" and link to the login page
        AuthenticationLink.textContent = "Login";

        // Link to login page which is home page
        AuthenticationLink.href = '../../index.html';

        // Removing click handler for logout
        AuthenticationLink.onclick = null;
    }
});
