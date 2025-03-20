import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check local storage on page load
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");
        const mobile = localStorage.getItem("mobile");

        if (token && userId && username && email && mobile) {
            setUser({ token, userId, username, email, mobile });
        }
    }, []);

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("mobile");
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
