import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Utilisateurs', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
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

    // TEST POST : Créer un nouvel utilisateur
    describe('POST /api/utilisateurs', () => {
        // it est utilisé pour définir un cas de test individuel
        it('devrait créer un nouvel utilisateur', async () => {
            // Données de l'utilisateur à créer
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.user.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1  // Manager
            };

            // Effectuer la requête POST pour créer l'utilisateur
            const response = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect('Content-Type', /json/)
                .expect(201);

            // Vérifier que la réponse contient les données attendues
            expect(response.body).toHaveProperty('id_utilisateur');
            expect(response.body.nom).toBe(newUser.nom);
            expect(response.body.email).toBe(newUser.email);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un utilisateur avec un email dupliqué', async () => {
            // Utiliser un email unique pour le test
            const email = `duplicate.${Date.now()}@example.com`;

            // Données de l'utilisateur
            const user = {
                nom: 'DUPONT',
                prenom: 'Jean',
                email,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            // Créer le premier utilisateur
            await request(app)
                .post('/api/utilisateurs')
                .send(user)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/utilisateurs')
                .send(user)
                .expect(409);
        });

        // Cas de test pour les données manquantes
        it('devrait rejeter un utilisateur avec des données manquantes', async () => {
            const incompleteUser = {
                nom: 'TEST',
                prenom: 'User'
                // email, mot_de_passe et roleIdRole manquants
            };

            // Tenter de créer un utilisateur avec des données incomplètes
            const response = await request(app)
                .post('/api/utilisateurs')
                .send(incompleteUser);

            // Le backend peut retourner 400 ou 409 selon la validation
            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un utilisateur existant
    describe('PUT /api/utilisateurs/:id', () => {
        it('devrait mettre à jour un utilisateur existant', async () => {
            // Créer d'abord un utilisateur
            const newUser = {
                nom: 'AVANT',
                prenom: 'Modification',
                email: `update.test.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const createResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = createResponse.body.id_utilisateur;

            // Modifier l'utilisateur
            const updatedData = {
                nom: 'APRES',
                prenom: 'Modification'
            };

            const updateResponse = await request(app)
                .put(`/api/utilisateurs/${userId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.nom).toBe(updatedData.nom);
        });

        it('devrait retourner 404 pour un utilisateur inexistant', async () => {
            await request(app)
                .put('/api/utilisateurs/999999')
                .send({ nom: 'TEST' })
                .expect(404);
        });
    });

    // TEST DELETE : Supprimer un utilisateur existant
    describe('DELETE /api/utilisateurs/:id', () => {
        it('devrait supprimer un utilisateur existant', async () => {
            // Créer d'abord un utilisateur
            const newUser = {
                nom: 'ASUPPRIMER',
                prenom: 'Test',
                email: `delete.test.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const createResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = createResponse.body.id_utilisateur;

            // Supprimer l'utilisateur
            await request(app)
                .delete(`/api/utilisateurs/${userId}`)
                .expect(204);

            // Vérifier que l'utilisateur n'existe plus
            await request(app)
                .put(`/api/utilisateurs/${userId}`)
                .send({ nom: 'TEST' })
                .expect(404);
        });

        it('devrait retourner 404 pour un utilisateur inexistant', async () => {
            await request(app)
                .delete('/api/utilisateurs/999999')
                .expect(404);
        });
    });
});