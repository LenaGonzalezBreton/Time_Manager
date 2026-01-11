import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Interface pour les données de connexion
export interface LoginCredentials {
    email: string;
    password: string;
}

// Interface pour les données d'inscription
export interface RegisterData {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    mot_de_passe: string;
    id_role: number;
}

// Interface pour les informations utilisateur
export interface User {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string | null;
    role: string;
}

// Interface pour la réponse de connexion
export interface LoginResponse {
    token: string;
    user: User;
}

/**
 * Service d'authentification
 */
class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    /**
     * Connexion utilisateur
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);

        // Stocker le token et les infos utilisateur
        this.setToken(response.data.token);
        this.setUser(response.data.user);

        return response.data;
    }

    /**
     * Inscription d'un nouvel utilisateur (manager uniquement)
     */
    async register(data: RegisterData): Promise<User> {
        const token = this.getToken();
        const response = await axios.post<User>(`${API_URL}/auth/register`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    }

    /**
     * Récupère les informations de l'utilisateur connecté
     */
    async getCurrentUser(): Promise<User> {
        const token = this.getToken();
        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await axios.get<User>(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        this.setUser(response.data);
        return response.data;
    }

    /**
     * Déconnexion
     */
    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    /**
     * Stocke le token JWT
     */
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Récupère le token JWT
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Stocke les informations utilisateur
     */
    setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    /**
     * Récupère les informations utilisateur stockées
     */
    getUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Vérifie si l'utilisateur est un manager
     */
    isManager(): boolean {
        const user = this.getUser();
        return user?.role.toLowerCase() === 'manager';
    }
}

export default new AuthService();
