// Firebase Authentication Helper Functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign up with email and password
 * @returns {Promise<string>} Firebase ID token
 */
export const signUpWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
};

/**
 * Sign up with Google OAuth
 * @returns {Promise<{idToken: string, photoURL: string|null}>} Firebase ID token and photo URL
 */
export const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const idToken = await userCredential.user.getIdToken();
  const photoURL = userCredential.user.photoURL;
  return { idToken, photoURL };
};

/**
 * Sign in with email and password
 * @returns {Promise<string>} Firebase ID token
 */
export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
};

/**
 * Sign in with Google OAuth
 * @returns {Promise<{idToken: string, photoURL: string|null}>} Firebase ID token and photo URL
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const idToken = await userCredential.user.getIdToken();
  const photoURL = userCredential.user.photoURL;
  return { idToken, photoURL };
};

/**
 * Sign out from Firebase
 */
export const signOut = async () => {
  await auth.signOut();
};
