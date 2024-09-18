/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file shows users the different views of Settings according to what they click on.
Notes: Connected to ../../index.html
*/

document.addEventListener("DOMContentLoaded", function() {
    const accountHeader = document.getElementById("AccountHeader");
    const profileBtn = document.getElementById("Profile");
    const passwordBtn = document.getElementById("Password");
    const appearanceHeader = document.getElementById("AppearanceHeader");

    const profileContent = document.getElementById("ProfileContent");
    const passwordContent = document.getElementById("PasswordContent");
    const appearanceContent = document.getElementById("AppearanceContent");

    function showSection(section) {
        profileContent.classList.add("hidden");
        passwordContent.classList.add("hidden");
        appearanceContent.classList.add("hidden");

        section.classList.remove("hidden");
    }

    profileBtn.addEventListener("click", function() {
        showSection(profileContent);
    });

    passwordBtn.addEventListener("click", function() {
        showSection(passwordContent);
    });

    appearanceHeader.addEventListener("click", function() {
        showSection(appearanceContent);
    });

    // Default view
    showSection(profileContent); 
});
