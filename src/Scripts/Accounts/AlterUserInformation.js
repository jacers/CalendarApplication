/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file will allow users to alter/change their account information
Notes: Connected to ../../../public/Pages/SettingPage.html
*/

// Import necessary Firebase modules
import { auth, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "../Firebase.js";

// Get references to DOM elements
const profileModal = document.getElementById('profileModal');
const confirmPasswordInput = document.getElementById('confirmPassword');
const confirmProfileUpdateBtn = document.getElementById('confirmProfileUpdate');
const cancelProfileUpdateBtn = document.getElementById('cancelProfileUpdate');

const updateProfileBtn = document.querySelector('#ProfileContent button');
const changePasswordBtn = document.querySelector('#PasswordContent button');

// Function to show the profile update modal
function showProfileModal() {
    profileModal.classList.remove('hidden');
}

// Function to hide the profile update modal
function hideProfileModal() {
    profileModal.classList.add('hidden');
}

// Function to handle profile update
async function handleProfileUpdate() {
    const firstName = document.getElementById('PFirstName').value;
    const lastName = document.getElementById('PLastName').value;
    const email = document.getElementById('PEmailAddress').value;
    const password = confirmPasswordInput.value;

    if (!firstName || !lastName || !email || !password) {
        alert('Please fill out all fields');
        return;
    }

    // Re-authenticate user
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
        await reauthenticateWithCredential(user, credential);

        // Update user profile
        await updateProfile(user, { displayName: `${firstName} ${lastName}` });
        
        // Update email if needed
        if (email !== user.email) {
            await user.updateEmail(email);
        }

        alert('Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
    }
}

// Function to handle password change
async function handlePasswordChange() {
    const currentPassword = document.getElementById('CurrentPassword').value;
    const newPassword = document.getElementById('NewPassword').value;

    if (!currentPassword || !newPassword) {
        alert('Please fill out all fields');
        return;
    }

    // Re-authenticate user
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
        await reauthenticateWithCredential(user, credential);
        await user.updatePassword(newPassword);
        alert('Password changed successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password');
    }
}

// Event listeners
updateProfileBtn.addEventListener('click', showProfileModal);
confirmProfileUpdateBtn.addEventListener('click', handleProfileUpdate);
cancelProfileUpdateBtn.addEventListener('click', hideProfileModal);
changePasswordBtn.addEventListener('click', handlePasswordChange);
