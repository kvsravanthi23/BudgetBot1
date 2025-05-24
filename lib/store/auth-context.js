"use client"
import { createContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const authContext = createContext({
    user: null,
    loading: false,
    googleLoginHandler: async () => {},
    logout: async () => {},
});

export default function AuthContextProvider({ children }) {
    const [user, loading] = useAuthState(auth);
    const googleProvider = new GoogleAuthProvider();

    const googleLoginHandler = async () => {
        try {
            const googleProvider = new GoogleAuthProvider();
            googleProvider.setCustomParameters({ prompt: "select_account" }); // Forces account selection
    
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Sign-in Error:", error);
        }
    };
    
    const logout = async () => {
        try {
            await signOut(auth);
            window.location.reload(); // Refresh the page to clear cached credentials
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };
    

    const values = {
        user,
        loading,
        googleLoginHandler,
        logout,
    };

    return <authContext.Provider value={values}>{children}</authContext.Provider>;
}
