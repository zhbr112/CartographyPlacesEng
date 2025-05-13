import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // State to hold the authentication token
    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [firstName, setFirstName] = useState(localStorage.getItem('first_name'));
    const [lastName, setLastName] = useState(localStorage.getItem('last_name'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [photoUrl, setPhotoUrl] = useState(localStorage.getItem('photo_url'));

    // Function to set the authentication token
    const setToken = (newToken) => {
        setToken_(newToken);
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem('token', token);
            localStorage.setItem('first_name', firstName);
            localStorage.setItem('last_name', lastName);
            localStorage.setItem('username', username);
            localStorage.setItem('photo_url', photoUrl);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('token');
            localStorage.removeItem('first_name');
            localStorage.removeItem('last_name');
            localStorage.removeItem('username');
            localStorage.removeItem('photo_url');
        }
    }, [token]);

    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({
            token,
            setToken,
            firstName,
            setFirstName,
            lastName,
            setLastName,
            username,
            setUsername,
            photoUrl,
            setPhotoUrl
        }),
        [token]
    );

    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
