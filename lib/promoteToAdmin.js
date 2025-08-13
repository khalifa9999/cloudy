import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function promoteCurrentUserToAdmin() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    // Create or update user document
    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing user to admin
      await setDoc(userRef, {
        ...userDoc.data(),
        role: 'admin',
        updatedAt: new Date()
      }, { merge: true });
      console.log('User promoted to admin successfully');
    } else {
      // Create new user document with admin role
      await setDoc(userRef, {
        email: currentUser.email,
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('New admin user created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    throw error;
  }
}

export async function ensureCurrentUserExists() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    const userRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        email: currentUser.email,
        role: 'user',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('User document created successfully');
    }
    
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    throw error;
  }
} 