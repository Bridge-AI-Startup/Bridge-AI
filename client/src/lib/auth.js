// Firebase Authentication Helper Functions
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign up with email and password
 * @returns {Promise<{idToken: string, user: User}>} Firebase ID token and user object
 */
export const signUpWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  return { idToken, user: userCredential.user };
};

/**
 * Sign up with Google OAuth
 * @returns {Promise<{idToken: string, user: User}>} Firebase ID token and user object
 */
export const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const idToken = await userCredential.user.getIdToken();
  return { idToken, user: userCredential.user };
};

/**
 * Delete a Firebase user (cleanup on signup failure)
 * @param {User} user - Firebase user object to delete
 */
export const deleteFirebaseUser = async (user) => {
  try {
    await deleteUser(user);
  } catch (error) {
    console.error('Error deleting Firebase user:', error);
    // Don't throw - we want to show the original error to the user
  }
};

/**
 * Sign in with email and password
 * @returns {Promise<string>} Firebase ID token
 */
export const signInWithEmail = async (email, password) => {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
};

/**
 * Sign in with Google OAuth
 * @returns {Promise<string>} Firebase ID token
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const { signInWithPopup } = await import('firebase/auth');
  const userCredential = await signInWithPopup(auth, provider);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
};
