import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated =  useSelector(state => state.tokens);// Your authentication logic here (e.g., using context or localStorage)

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
