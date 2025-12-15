import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authContext';

const RutaProtegida = ({ children, isAdminRoute = false }) => {
    const { usuario, isAdmin } = useAuth();

    if (!usuario) {
        return <Navigate to="/inicio" replace />;
    }

    if (isAdminRoute && !isAdmin) {
        return <Navigate to="/inicio" replace />;
    }   

    return children;
};

export default RutaProtegida;
