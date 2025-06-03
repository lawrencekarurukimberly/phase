// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase/config'; // Client-side Firebase auth instance
import { registerProfile, getProfile } from '../api/petpalsApi'; // Backend API calls
import LoadingSpinner from '../components/Common/LoadingSpinner'; // Ensure this import is correct

const AuthContext = createContext();

// Make sure 'useAuth' is explicitly exported as a named export
export const useAuth = () => { // <--- THIS LINE IS CRUCIAL
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const idToken = await user.getIdToken();
          localStorage.setItem('token', idToken);
          // Corrected: Access data directly, not data.user
          const profileResponse = await getProfile();
          setUserProfile(profileResponse.data); // Corrected line
        } catch (error) {
          console.error("Error fetching user profile:", error.message);
          // If profile fetching fails (e.g., profile not yet registered), clear it
          // This ensures the header correctly shows "Login/Sign Up" if profile is missing
          setUserProfile(null);
        }
      } else {
        // User logged out or no user is signed in
        setCurrentUser(null);
        setUserProfile(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true); // Start loading before login attempt
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);

      setCurrentUser(user); // Update current user
      try {
        const profileResponse = await getProfile();
        setUserProfile(profileResponse.data); // Set profile after login
      } catch (profileError) {
        console.error("Error fetching user profile after login:", profileError.message);
        setUserProfile(null); // Clear profile if fetching fails
        // Consider specific handling if profile is expected but not found after login
      }
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.message);
      let errorMessage = 'Failed to log in. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }
      setLoading(false); // Stop loading on error
      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, name, role) => {
    try {
      setLoading(true); // Start loading before registration attempt
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);

      // Call backend to register profile and capture the response
      const registerProfileResponse = await registerProfile({ email: user.email, name, role }); // Firebase UID is handled by backend's get_firebase_user_by_token

      setCurrentUser(user); // Set Firebase user
      setUserProfile(registerProfileResponse.data); // Corrected: Set profile immediately from registration response

      setLoading(false); // Stop loading after successful registration
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error.message);
      let errorMessage = 'Failed to register.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      setLoading(false); // Stop loading on error
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear state and local storage immediately on logout
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error.message);
      return { success: false, error: 'Failed to log out.' };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading, // Make sure loading state is passed
    login,
    register,
    logout,
  };

  // Only render children when authentication state has been determined
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};