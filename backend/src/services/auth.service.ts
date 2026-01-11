import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source.js";
import { Utilisateur } from "../entities/Utilisateur.js";
import { Role } from "../entities/Role.js";

const repo = () => AppDataSource.getRepository(Utilisateur);
const roleRepo = () => AppDataSource.getRepository(Role);

// Configuration JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
const SALT_ROUNDS = 10;

// Interface pour le payload du token JWT
export interface JwtPayload {
    id_utilisateur: number;
    email: string;
    role: string;
}

/**
 * Hash un mot de passe avec bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare un mot de passe en clair avec un hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

/**
 * Génère un token JWT pour un utilisateur
 */
export function generateToken(user: { id_utilisateur: number; email: string; role: string }): string {
    const payload: JwtPayload = {
        id_utilisateur: user.id_utilisateur,
        email: user.email,
        role: user.role
    };

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Vérifie et décode un token JWT
 */
export function verifyToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw { status: 401, message: "Token invalide ou expiré" };
    }
}

/**
 * Authentifie un utilisateur avec email et mot de passe
 */
export async function login(email: string, password: string) {
    // Trouver l'utilisateur par email avec son rôle
    const user = await repo().findOne({
        where: { email },
        relations: ["role", "equipe"]
    });

    if (!user) {
        throw { status: 401, message: "Email ou mot de passe incorrect" };
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.mot_de_passe);

    if (!isPasswordValid) {
        throw { status: 401, message: "Email ou mot de passe incorrect" };
    }

    // Générer le token JWT
    const token = generateToken({
        id_utilisateur: user.id_utilisateur,
        email: user.email,
        role: user.role?.titre || "employee"
    });

    // Retourner le token et les informations utilisateur (sans le mot de passe)
    return {
        token,
        user: {
            id_utilisateur: user.id_utilisateur,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone,
            role: user.role?.titre || "employee",
            equipe: user.equipe
        }
    };
}

/**
 * Enregistre un nouvel utilisateur (réservé aux managers)
 */
export async function register(data: {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    mot_de_passe: string;
    id_role: number;
}) {
    // Vérifier si l'email existe déjà
    const existing = await repo().findOneBy({ email: data.email });
    if (existing) {
        throw { status: 409, message: "Cet email est déjà utilisé" };
    }

    // Vérifier que le rôle existe
    const role = await roleRepo().findOneBy({ id_role: data.id_role });
    if (!role) {
        throw { status: 400, message: "Rôle invalide" };
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(data.mot_de_passe);

    // Créer l'utilisateur
    const user = repo().create({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone || null,
        mot_de_passe: hashedPassword,
        role
    });

    const savedUser = await repo().save(user);

    // Retourner l'utilisateur sans le mot de passe
    return {
        id_utilisateur: savedUser.id_utilisateur,
        nom: savedUser.nom,
        prenom: savedUser.prenom,
        email: savedUser.email,
        telephone: savedUser.telephone,
        role: role.titre
    };
}

/**
 * Récupère les informations d'un utilisateur par son ID
 */
export async function getUserById(id_utilisateur: number) {
    const user = await repo().findOne({
        where: { id_utilisateur },
        relations: ["role", "equipe"]
    });

    if (!user) {
        throw { status: 404, message: "Utilisateur introuvable" };
    }

    return {
        id_utilisateur: user.id_utilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role?.titre || "employee",
        equipe: user.equipe
    };
}
