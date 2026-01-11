import { setupTestDatabase, teardownTestDatabase } from './setup.js';

// Avant tous les tests, initialiser la base de données de test
beforeAll(async () => {
    await setupTestDatabase();
}, 60000); // Timeout de 60 secondes pour l'initialisation

// Après tous les tests, fermer la connexion à la base de données de test
afterAll(async () => {
    await teardownTestDatabase();
}, 30000); // Timeout de 30 secondes pour la fermeture