import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth as firebaseAuth } from '../firebase';

export const AuthContext = createContext();

// Helper to set token for all axios requests
const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // This is our MongoDB user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // This function fetches our user data (with roles/bookmarks) from our own server
  const loadUser = async () => {
    const token = await firebaseAuth.currentUser?.getIdToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthHeader(token);
    try {
      const res = await axios.get('http://localhost:5000/api/auth');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error loading user data from MongoDB:", err);
      await signOut(firebaseAuth); // Force logout if Mongo user not found
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in to Firebase. Load their data from our DB.
        loadUser();
      } else {
        // User is signed out.
        setAuthHeader(null);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
    // onAuthStateChanged will fire and call loadUser()
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    // onAuthStateChanged will fire and clear state
  };

  return (
    // We now export loadUser so other components can call it
    <AuthContext.Provider value={{ token: null, user, isAuthenticated, loading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};