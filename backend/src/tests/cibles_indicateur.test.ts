import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Cibles Indicateur', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des cibles d'indicateur
    describe('GET /api/cibles-indicateur', () => {
        it('devrait retourner la liste des cibles d\'indicateur', async () => {
            const response = await request(app)
                .get('/api/cibles-indicateur')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer une nouvelle cible d'indicateur
    describe('POST /api/cibles-indicateur', () => {
        it('devrait créer une nouvelle cible d\'indicateur pour un utilisateur', async () => {
            // Créer d'abord un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.cible.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = userResponse.body.id_utilisateur;

            // Créer une cible d'indicateur
            const newCible = {
                type_cible: 'utilisateur',
                id_cible: userId,
                objectif_presence: 95.0,
                objectif_retard: 5.0
            };

            const response = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_cible_indicateur');
            expect(response.body.type_cible).toBe(newCible.type_cible);
            expect(response.body.id_cible).toBe(newCible.id_cible);
        });

        it('devrait créer une cible d\'indicateur pour une équipe', async () => {
            // Créer d'abord une équipe
            const newEquipe = {
                nom: `EquipeCible_${Date.now()}`,
                description: 'Équipe pour test cible'
            };

            const equipeResponse = await request(app)
                .post('/api/equipes')
                .send(newEquipe)
                .expect(201);

            const equipeId = equipeResponse.body.id_equipe;

            // Créer une cible d'indicateur
            const newCible = {
                type_cible: 'equipe',
                id_cible: equipeId,
                objectif_presence: 90.0,
                objectif_retard: 10.0
            };

            const response = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            expect(response.body).toHaveProperty('id_cible_indicateur');
            expect(response.body.type_cible).toBe(newCible.type_cible);
        });

        it('devrait créer une cible d\'indicateur avec des valeurs nullables', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.cible.null.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer une cible sans objectifs
            const newCible = {
                type_cible: 'utilisateur',
                id_cible: userResponse.body.id_utilisateur,
                objectif_presence: null,
                objectif_retard: null
            };

            const response = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            expect(response.body).toHaveProperty('id_cible_indicateur');
        });

        // Cas de test pour les erreurs
        it('devrait rejeter une cible d\'indicateur avec un type invalide', async () => {
            const invalidCible = {
                type_cible: 'invalid_type',
                id_cible: 1
            };

            const response = await request(app)
                .post('/api/cibles-indicateur')
                .send(invalidCible);

            expect([400, 500]).toContain(response.status);
        });

        it('devrait rejeter une cible d\'indicateur dupliquée', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.duplicate.cible.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const cible = {
                type_cible: 'utilisateur',
                id_cible: userResponse.body.id_utilisateur
            };

            // Créer la première cible
            await request(app)
                .post('/api/cibles-indicateur')
                .send(cible)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/cibles-indicateur')
                .send(cible)
                .expect(409);
        });

        it('devrait rejeter une cible d\'indicateur avec des données manquantes', async () => {
            const incompleteCible = {
                type_cible: 'utilisateur'
                // id_cible manquant
            };

            const response = await request(app)
                .post('/api/cibles-indicateur')
                .send(incompleteCible);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour une cible d'indicateur existante
    describe('PUT /api/cibles-indicateur/:id', () => {
        it('devrait mettre à jour une cible d\'indicateur existante', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.update.cible.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer une cible d'indicateur
            const newCible = {
                type_cible: 'utilisateur',
                id_cible: userResponse.body.id_utilisateur,
                objectif_presence: 90.0,
                objectif_retard: 10.0
            };

            const createResponse = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            const cibleId = createResponse.body.id_cible_indicateur;

            // Modifier la cible d'indicateur
            const updatedData = {
                objectif_presence: 95.0,
                objectif_retard: 5.0
            };

            const updateResponse = await request(app)
                .put(`/api/cibles-indicateur/${cibleId}`)
                .send(updatedData)
                .expect(200);

            expect(parseFloat(updateResponse.body.objectif_presence)).toBe(updatedData.objectif_presence);
            expect(parseFloat(updateResponse.body.objectif_retard)).toBe(updatedData.objectif_retard);
        });

        it('devrait retourner 404 pour une cible d\'indicateur inexistante', async () => {
            await request(app)
                .put('/api/cibles-indicateur/999999')
                .send({ objectif_presence: 95.0 })
                .expect(404);
        });
    });

    // TEST DELETE : Supprimer une cible d'indicateur existante
    describe('DELETE /api/cibles-indicateur/:id', () => {
        it('devrait supprimer une cible d\'indicateur existante', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.delete.cible.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Créer une cible d'indicateur
            const newCible = {
                type_cible: 'utilisateur',
                id_cible: userResponse.body.id_utilisateur
            };

            const createResponse = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            const cibleId = createResponse.body.id_cible_indicateur;

            // Supprimer la cible d'indicateur
            await request(app)
                .delete(`/api/cibles-indicateur/${cibleId}`)
                .expect(204);

            // Vérifier que la cible d'indicateur n'existe plus
            await request(app)
                .put(`/api/cibles-indicateur/${cibleId}`)
                .send({ objectif_presence: 95.0 })
                .expect(404);
        });

        it('devrait retourner 404 pour une cible d\'indicateur inexistante', async () => {
            await request(app)
                .delete('/api/cibles-indicateur/999999')
                .expect(404);
        });
    });
});

