/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file performs checks on whether or not the username does not have a space
         (which should not be allowed)
Notes: Connected to RegistrationPage.html
*/

// Waiting for the HTML docuemnt to be fully loaded before performing any actions
document.addEventListener("DOMContentLoaded", function() {
    // Retrieving references needed to and from the form
    var usernameInput = document.getElementById("Username");
    var registrationForm = document.getElementById("RegistrationForm");

    // Adding an event listener to the form
    registrationForm.addEventListener("submit", function(event) {
        // Stopping the action from occurring so that checks can be performed
        event.preventDefault();

        // Getting the actual value from the username input
        var username = usernameInput.value;

        if(/\s/.test(username)) {
            usernameInput.setCustomValidity("Usernames cannot contain spaces");
            return;
        }
        else {
            usernameInput.setCustomValidity("TESTER");
            return;
        }

        // If the username does not contain a space, the form can be submitted
        //this.submit();
    });
});

