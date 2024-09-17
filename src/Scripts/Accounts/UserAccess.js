/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file will restrict some sections/pages according to user authentication (Whether they are logged in or logged out)
Notes: Connected to ../../../index.html
*/

// Import necessary Firebase functions
import { auth, onAuthStateChanged, signOut } from "../Firebase.js";

// Get references to the elements
const settingsLink = document.getElementById("SettingLink");
const authLink = document.getElementById("AuthenticationLink");

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {

    // Checking the status of user (whetehr or logged in or not)
    if (user) 
        {
        // User is authenticated, show the Settings link and update Login to Logout
        if (settingsLink) 
        {
            // Show the link via JS
            settingsLink.style.display = "block";
        }

        // Make the dropdown display Logout
        authLink.textContent = "Logout";

        // Add a click listener
        authLink.onclick = () => {

            // Action upon logout which is redirection
            signOut(auth).then(() => {
                window.location.href = "../../index.html";
            }).catch((error) => {
                console.error("Error during logout:", error);
            });
        };
    } else {
        // User is not authenticated, hide the Settings link and show Login
        if (settingsLink) 
        {
            settingsLink.style.display = "none";
        }

        // Display the word Login to users
        authLink.textContent = "Login";

        // Link to the login page
        authLink.href = "../../index.html";

        // Remove logout click listener
        authLink.onclick = null;
    }
});
