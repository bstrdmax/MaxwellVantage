import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Defines the shape of the authentication context provided to the app.
 */
interface AuthContextType {
    currentUser: User | null; // The authenticated Firebase user object, or null if not logged in.
    loading: boolean;         // True while the initial authentication state is being determined.
}

// Create the React Context for authentication.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * A custom hook to easily access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns The current authentication context.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * The provider component that wraps the application to make authentication state available.
 * It listens for changes in Firebase's authentication state and updates its own state accordingly.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged is a Firebase listener that fires whenever the user's
        // sign-in state changes. It returns an unsubscribe function.
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false); // Set loading to false once the initial state is determined.
        });

        // The returned function will be called when the component unmounts,
        // which cleans up the subscription and prevents memory leaks.
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
