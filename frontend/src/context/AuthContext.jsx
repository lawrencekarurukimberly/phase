// frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase/config'; // Client-side Firebase auth instance
import { registerProfile, getProfile } from '../api/petpalsApi'; // Backend API calls

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Add a check here for robust error handling, as discussed before
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase User object from client SDK
  const [userProfile, setUserProfile] = useState(null); // User's custom profile from our backend (contains role)
  const [loading, setLoading] = useState(true); // Initial state for auth check

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in with Firebase Auth
        setCurrentUser(user);
        try {
          // Get Firebase ID token
          const idToken = await user.getIdToken();
          localStorage.setItem('token', idToken); // Store it for backend API calls

          // Fetch user's profile from our backend to get their role and other details
          const profileResponse = await getProfile();
          setUserProfile(profileResponse.data.user);
        } catch (error) {
          console.error("Error fetching user profile from backend:", error.response?.data?.message || error.message);
          // If profile fetch fails, it means the user's profile might not exist in Firestore yet
          // or there's a backend issue. Clear auth state.
          await firebaseSignOut(auth); // Force sign out if profile fails
          localStorage.removeItem('token');
          setCurrentUser(null);
          setUserProfile(null);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserProfile(null);
        localStorage.removeItem('token');
      }
      setLoading(false); // Auth state check is complete
    });

    return unsubscribe; // Clean up the listener
  }, []); // Run only once on mount

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.message);
      let errorMessage = 'Failed to log in.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.';
      }
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, name, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);

      await registerProfile({ uid: user.uid, email: user.email, name, role });

      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error.message);
      let errorMessage = 'Failed to register.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
    
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error.message);
      return { success: false, error: 'Failed to log out.' };
    }
  };

  const value = {
    currentUser,    // Firebase Auth user (uid, email, etc.)
    userProfile,    // Our custom user profile from Firestore (role, name, etc.)
    loading,        // Is initial authentication check complete?
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* <--- CORRECTED LINE: Always render children */}
    </AuthContext.Provider>
  );
};