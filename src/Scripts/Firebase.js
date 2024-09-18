/*
Author: Lyndsey Dong
Language: Javascript
Purpose: This file will import and export any needed Firebase functions and provides connectivity to Firebase
Notes: Connected to ../../index.html
*/


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updateProfile, updatePassword} from 'firebase/auth';

// Adding in Firestore
import {getFirestore, doc, setDoc, collection, addDoc, deleteDoc, updateDoc, query, where, getDocs, getDoc} from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCa25R7DE_HEnXyABOGjC1uMdi_glM5AOM",
  authDomain: "calendar-application-d87fa.firebaseapp.com",
  projectId: "calendar-application-d87fa",
  storageBucket: "calendar-application-d87fa.appspot.com",
  messagingSenderId: "636397139768",
  appId: "1:636397139768:web:3ebd33161ca95dd35f33cd",
  measurementId: "G-43PFJ4LX3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Databse initialization
const database = getFirestore(app);

// Firebase authentication initialization
const auth = getAuth(app);

// Exporting the database object
export {
  database,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
  updatePassword,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  query, 
  where,
  getDocs,
  getDoc
};
