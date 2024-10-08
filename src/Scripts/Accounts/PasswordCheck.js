/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file performs checks on whether or not the entered password meets the requirements
         and displays the according response (Dynamic checker)
Notes: Connected to ../../..index.html
*/

// OPTIONAL: We can add in focus onto the texts or element boxes when an error occurs (I believe it can also be done in HTML)

// Waiting for the HTML document to be fully loaded before performing any actions
document.addEventListener("DOMContentLoaded", function() { 
    // Retrieve references to the HTML elements based on the IDs we gave them
    var passwordInput = document.getElementById("RPassword");
    var passwordRequirements = document.getElementById("PasswordRequirements").getElementsByTagName("li");

    // The following will be the dynamically updating list that users will see for the password requirements
    passwordInput.addEventListener("input", function() {
        // Clearing any previous validity message(s) if any
        passwordInput.setCustomValidity("");

        // Getting the string value from the password input field
        var password = this.value;

        // Iterating over each item in the password requirements list to
        // remove the former signs beside them to add in new ones
        for (var listItem = 0; listItem < passwordRequirements.length; listItem++) {
            passwordRequirements[listItem].classList.remove("valid", "invalid")
        }

        // The following loops will update the lists based on the requirements

        // Updating the list based on the length of the password, which has to be 
        // between 6-24 characters
        if(password.length >= 6 && password.length <= 24) {
            passwordRequirements[0].classList.add("valid");
        } else {
            passwordRequirements[0].classList.add("invalid");
        }

        // Updating the list based on the special characters, which has to have at
        // least one special character
        // Regex expression is accepting any non-characters and underscores
        if (/[\W_]/.test(password)) {
            passwordRequirements[1].classList.add("valid");
        } else {
            passwordRequirements[1].classList.add("invalid");
        }

        // Updating the list based on the numbers, which has to contain at least
        // one number character
        // Regex expression is accepting any digit character
        if(/\d/.test(password)) {
            passwordRequirements[2].classList.add("valid");
        } else {
            passwordRequirements[2].classList.add("invalid");
        }

        // Updating the list based on the uppercase letters, which the password needs
        // at least on uppercase letter
        // Regex expression is accepting any uppercase letter
        if (/[A-Z]/.test(password)) {
            passwordRequirements[3].classList.add("valid");
        } else {
            passwordRequirements[3].classList.add("invalid");
        }

        // Updating the list based on the lowercase letters, where the password
        // must contain at least one lowercase letter
        if (/[a-z]/.test(password)) {
            passwordRequirements[4].classList.add("valid");
        } else {
                passwordRequirements[4].classList.add("invalid");
        }
    });
});

// This function is to check whether or not the password meets the requirements and
// displays the custom validation message accordingly
export function checkPasswordRequirements(password)
{
    // Checking all the requirements at once and returning the results
    return password.length >= 6 &&
           password.length <= 24 &&
           /[\W_]/.test(password) &&
           /\d/.test(password) &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password);
}

// This function is to check if the given input is empty
export function checkEmpty(input)
{
    // Trimes the given input and checks if its empty
    return input.trim() === "";
}