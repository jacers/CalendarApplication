/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file animates home page dynamically revealing (as of right now the right side of Home)
Notes: Connected to ../../../index.html
*/

// Animation to switch between login and registration
document.getElementById("RegistrationLink").addEventListener("click", function(event) 
{
    event.preventDefault();
    document.getElementById("LoginSection").style.display = "none";
    document.getElementById('RegistrationForm').style.display = 'block';
});

document.getElementById("LoginLink").addEventListener("click", function(event) 
{
    event.preventDefault();
    document.getElementById("RegistrationForm").style.display = "none";
    document.getElementById("LoginSection").style.display = "block";
});
