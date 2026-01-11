import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireManager?: boolean;
}

/**
 * Composant de route protégée
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 * Redirige vers /dashboard si l'utilisateur n'a pas les permissions requises
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireManager = false }) => {
    const { isAuthenticated, isManager, loading } = useAuth();

    // Afficher un loader pendant le chargement
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-200">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
                    <p className="mt-4 text-blue-950 font-semibold">Chargement...</p>
                </div>
            </div>
        );
    }

    // Rediriger vers login si non authentifié
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Rediriger vers dashboard si manager requis mais utilisateur n'est pas manager
    if (requireManager && !isManager) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
