/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file will allow users to alter/change their account information
Notes: Connected to ../../../public/Pages/SettingPage.html
*/

// ANYTHING WIH ALERT WILL BE CHANGED TO A NOTIFICATION (EITHER IN PAGE, MODAL, OR TOAST)

// Import necessary Firebase modules
import { auth, onAuthStateChanged, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "../Firebase.js";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { database, updatePassword } from "../Firebase.js"; // Ensure db is properly initialized

// Get references to DOM elements
const profileModal = document.getElementById("ProfileModal");
const confirmPasswordInput = document.getElementById("ConfirmPassword");
const confirmProfileUpdateBtn = document.getElementById("ConfirmProfileUpdate");
const cancelProfileUpdateBtn = document.getElementById("CancelProfileUpdate");

const firstNameInput = document.getElementById("PFirstName");
const lastNameInput = document.getElementById("PLastName");
const emailInput = document.getElementById("PEmailAddress");
const updateProfileBtn = document.querySelector("#ProfileContent button");
const changePasswordBtn = document.querySelector("#PasswordContent button");

// Pre-fill profile info from Firestore when user is authenticated
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Get the user's profile data from Firestore
            const userDocRef = doc(database, "Users", user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Prefill form inputs with Firestore data
                firstNameInput.value = userData.FirstName || "";
                lastNameInput.value = userData.LastName || "";
                emailInput.value = userData.EmailAddress || "";
            } else {
                console.log("No document exists for what is being requested.");
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    } else {
        // Redirect to login if not logged in
        window.location.href = "../../index.html";
    }
});

// Function to show the profile update modal
function showProfileModal() {
    profileModal.classList.remove("hidden");
}

// Function to hide the profile update modal
function hideProfileModal() {
    profileModal.classList.add("hidden");
}

// Function to handle profile update
async function handleProfileUpdate() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const password = confirmPasswordInput.value;

    if (!firstName || !lastName || !email || !password) {
        firstNameInput.setCustomValidity("Please fill out all fields");
        return;
    }

    // Re-authenticate user
    const user = auth.currentUser;
    if (!user) {
        alert("User not authenticated");
        return;
    }

    try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        // Update user profile
        await updateProfile(user, { displayName: `${firstName} ${lastName}` });
        
        // Update Firestore with the new names
        const userDocRef = doc(database, "Users", user.uid);
        await updateDoc(userDocRef, {
            FirstName: firstName,
            LastName: lastName,
            EmailAddress: email
        });

        // Update email if it's changed
        if (email !== user.email) {
            await user.updateEmail(email);
        }

        // Show success message (MIGHT USE TOAST)
        alert("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
    }
}

// Function to handle password change
async function handlePasswordChange() {
    const currentPassword = document.getElementById("CurrentPassword").value;
    const newPassword = document.getElementById("NewPassword").value;

    if (!currentPassword || !newPassword) {
        alert("Please fill out all fields");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert("User not authenticated");
        return;
    }

    try {
        // Re-authenticate user with current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Use the standalone `updatePassword` function
        await updatePassword(user, newPassword);

        alert("Password changed successfully");
    } catch (error) {
        console.error("Error changing password:", error.message);
        alert("Error changing password: " + error.message);
    }
}


// Event listeners
updateProfileBtn.addEventListener("click", showProfileModal);
confirmProfileUpdateBtn.addEventListener("click", handleProfileUpdate);
cancelProfileUpdateBtn.addEventListener("click", hideProfileModal);
changePasswordBtn.addEventListener("click", handlePasswordChange);
