
import { createContext, useContext, useState } from "react";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Login using HTTP Basic authentication
    const login = async (username, password) => {

        const credentials = btoa(`${username}:${password}`);
        const authHeader = `Basic ${credentials}`;

        // Store credentials before calling the API.
        sessionStorage.setItem("authHeader", authHeader);

        try {
            setLoading(true);

            // Backend validates credentials here.
            const currentUser = await getCurrentUser();

            setUser(currentUser);

            return currentUser;

        } catch (error) {

            sessionStorage.removeItem("authHeader");
            setUser(null);

            throw error;

        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        sessionStorage.removeItem("authHeader");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to access authentication context
export function useAuth() {
    return useContext(AuthContext);
}
