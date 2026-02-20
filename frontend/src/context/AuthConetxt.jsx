import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const navigate = useNavigate();

    // ✅ Check auth on app load (important for refresh)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/users"); // protected route
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // ✅ Logout function
    const logout = async () => {
        try {
            await api.post("/users/logout");
            setIsAuthenticated(false);
            // navigate("/login");
        } catch (error) {
            console.error("Logout failed");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);