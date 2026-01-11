import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService, { type User, type LoginCredentials, type RegisterData } from '../services/authService';

// Interface pour le contexte d'authentification
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<User>;
    logout: () => void;
    isAuthenticated: boolean;
    isManager: boolean;
}

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props du provider
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Provider d'authentification
 * Gère l'état global de l'authentification dans l'application
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur au démarrage de l'application
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Erreur lors du chargement de l\'utilisateur:', error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    /**
     * Connexion
     */
    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    };

    /**
     * Inscription (manager uniquement)
     */
    const register = async (data: RegisterData): Promise<User> => {
        try {
            const newUser = await authService.register(data);
            // Note: L'inscription ne connecte pas automatiquement l'utilisateur
            return newUser;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    };

    /**
     * Déconnexion
     */
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isManager: user?.role.toLowerCase() === 'manager',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};
