const dotenv = require('dotenv');
const path = require('path');

// Charger le fichier .env.test pour les tests
dotenv.config({ path: path.resolve(__dirname, '..', '.env.test') });

module.exports = {
    // Utiliser ts-jest pour gérer les fichiers TypeScript
    preset: 'ts-jest',
    // Environnement de test Node.js
    testEnvironment: 'node',
    // Chercher les fichiers qui finissent par .test.ts ou .spec.ts
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    // Ignorer le dossier node_modules
    testPathIgnorePatterns: ['/node_modules/'],
    // Fichiers à exécuter avant les tests (pour initialisation)
    setupFilesAfterEnv: [],
    // Configuration de ts-jest
    globals: {
        'ts-jest': {
            tsconfig: {
                types: ['jest', 'node', '@types/supertest']
            }
        }
    },
    // Timeout par défaut pour les tests (30 secondes)
    testTimeout: 30000,
};