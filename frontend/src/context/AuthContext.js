import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

  // Add this to decode the token

// Create Auth Context
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to register a new user
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/users/register', { name, email, password });
      setUser({ ...response.data.user, token: response.data.token });
      localStorage.setItem('token', response.data.token); // Store token in localStorage
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      setUser({ ...response.data.user, token: response.data.token });
      localStorage.setItem('token', response.data.token); // Store token in localStorage
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };
  
  // Function to log out a user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  // Auto-login if token is present in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to decode the token to extract user details here
      try {
        const decodedUser = jwtDecode(token); // Assuming jwtDecode is imported correctly
        setUser({ ...decodedUser, token });
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null); // Ensure invalid token clears the user
      }
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
  
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
