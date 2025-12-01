import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../data-source';

describe('Tests API Utilisateurs', () => {
    // Initialisation de la connexion à la base de données avant tous les tests
    beforeAll(async () => {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    });

    // Fermeture de la connexion après tous les tests
    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    // TEST GET : Récupérer la liste des utilisateurs
    describe('GET /api/utilisateurs', () => {
        it('devrait retourner la liste des utilisateurs', async () => {
            const response = await request(app)
                .get('/api/utilisateurs')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});
