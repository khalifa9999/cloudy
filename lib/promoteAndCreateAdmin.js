// Usage: node lib/promoteAndCreateAdmin.js <EMAIL> <PASSWORD>
// This script creates a new user (or updates existing) and makes them admin in Firestore.

const { initializeApp, getApps } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Copy your firebaseConfig from lib/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCn1fWXX6Ns78W3EVuXVQ0eqaMI-dzq68o",
  authDomain: "atv-auto.firebaseapp.com",
  projectId: "atv-auto",
  storageBucket: "atv-auto.firebasestorage.app",
  messagingSenderId: "510785610697",
  appId: "1:510785610697:web:e1ee5006363b7261ba7e18",
  measurementId: "G-RN6NFXCQRH"
};

async function promoteAndCreateAdmin(email, password) {
  if (!email || !password) {
    console.error('Usage: node lib/promoteAndCreateAdmin.js <EMAIL> <PASSWORD>');
    process.exit(1);
  }
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Check if user exists
  let uid;
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length === 0) {
      // User does not exist, create
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      uid = userCred.user.uid;
      console.log(`Created new user: ${email}`);
    } else {
      // User exists, get UID from Firestore
      // Try to find user doc by email
      const usersRef = doc(db, 'users', email); // Try by email as doc id
      const userDoc = await getDoc(usersRef);
      if (userDoc.exists()) {
        uid = userDoc.id;
      } else {
        // Fallback: ask user for UID
        console.error('User exists but UID could not be found in Firestore. Please provide the UID.');
        process.exit(1);
      }
      console.log(`User already exists: ${email}`);
    }
  } catch (err) {
    console.error('Error checking/creating user:', err);
    process.exit(1);
  }

  // Set Firestore user doc to admin
  try {
    await setDoc(doc(db, 'users', uid), { email, role: 'admin' }, { merge: true });
    console.log(`User ${email} (${uid}) is now an admin.`);
  } catch (err) {
    console.error('Error updating Firestore user document:', err);
    process.exit(1);
  }
}

const email = process.argv[2];
const password = process.argv[3];
promoteAndCreateAdmin(email, password); 