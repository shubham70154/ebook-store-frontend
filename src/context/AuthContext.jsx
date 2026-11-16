
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore login when the application starts.
    useEffect(() => {

        const restoreSession = async () => {

            const authHeader = sessionStorage.getItem("authHeader");

            if (!authHeader) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);

            } catch (error) {
                sessionStorage.removeItem("authHeader");
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        restoreSession();

    }, []);

    // Login
    const login = async (username, password) => {

        const credentials = btoa(`${username}:${password}`);
        const authHeader = `Basic ${credentials}`;

        sessionStorage.setItem("authHeader", authHeader);

        try {
            setLoading(true);

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

export function useAuth() {
    return useContext(AuthContext);
}
