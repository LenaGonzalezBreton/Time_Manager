import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Indicateurs', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des indicateurs
    describe('GET /api/indicateurs', () => {
        it('devrait retourner la liste des indicateurs', async () => {
            const response = await request(app)
                .get('/api/indicateurs')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer un nouvel indicateur
    describe('POST /api/indicateurs', () => {
        it('devrait créer un nouvel indicateur', async () => {
            // Créer d'abord une cible d'indicateur
            // Note: Cela nécessite potentiellement une équipe et un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.indicateur.${Date.now()}@example.com`,
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

            const cibleResponse = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            const cibleId = cibleResponse.body.id_cible_indicateur;

            // Créer l'indicateur
            const newIndicateur = {
                id_cible_indicateur: cibleId,
                date_periode: '2025-06-01',
                taux_retard: '3.5',
                taux_presence: '96.5',
                minutes_travaillees: 2400,
                minutes_retards: 85
            };

            const response = await request(app)
                .post('/api/indicateurs')
                .send(newIndicateur)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_indicateur');
            expect(response.body.date_periode).toBe(newIndicateur.date_periode);
            expect(response.body.minutes_travaillees).toBe(newIndicateur.minutes_travaillees);
        });

        it('devrait créer un indicateur avec des valeurs nullables', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.indicateur.null.${Date.now()}@example.com`,
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

            const cibleResponse = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            // Créer un indicateur avec des valeurs nulles
            const newIndicateur = {
                id_cible_indicateur: cibleResponse.body.id_cible_indicateur,
                date_periode: '2025-06-02',
                taux_retard: null,
                taux_presence: null,
                minutes_travaillees: 0,
                minutes_retards: 0
            };

            const response = await request(app)
                .post('/api/indicateurs')
                .send(newIndicateur)
                .expect(201);

            expect(response.body).toHaveProperty('id_indicateur');
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un indicateur avec une cible invalide', async () => {
            const invalidIndicateur = {
                id_cible_indicateur: 999999, // Cible inexistante
                date_periode: '2025-06-03'
            };

            await request(app)
                .post('/api/indicateurs')
                .send(invalidIndicateur)
                .expect(400);
        });

        it('devrait rejeter un indicateur dupliqué (même cible et même période)', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.duplicate.indic.${Date.now()}@example.com`,
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

            const cibleResponse = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            const indicateur = {
                id_cible_indicateur: cibleResponse.body.id_cible_indicateur,
                date_periode: '2025-06-04'
            };

            // Créer le premier indicateur
            await request(app)
                .post('/api/indicateurs')
                .send(indicateur)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/indicateurs')
                .send(indicateur)
                .expect(409);
        });

        it('devrait rejeter un indicateur avec des données manquantes', async () => {
            const incompleteIndicateur = {
                date_periode: '2025-06-05'
                // id_cible_indicateur manquant
            };

            const response = await request(app)
                .post('/api/indicateurs')
                .send(incompleteIndicateur);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un indicateur existant
    describe('PUT /api/indicateurs/:id', () => {
        it('devrait mettre à jour un indicateur existant', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.update.indic.${Date.now()}@example.com`,
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

            const cibleResponse = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            // Créer un indicateur
            const newIndicateur = {
                id_cible_indicateur: cibleResponse.body.id_cible_indicateur,
                date_periode: '2025-06-06',
                taux_retard: '5.0',
                taux_presence: '95.0',
                minutes_travaillees: 2000,
                minutes_retards: 100
            };

            const createResponse = await request(app)
                .post('/api/indicateurs')
                .send(newIndicateur)
                .expect(201);

            const indicateurId = createResponse.body.id_indicateur;

            // Modifier l'indicateur
            const updatedData = {
                taux_retard: '3.0',
                taux_presence: '97.0',
                minutes_travaillees: 2200,
                minutes_retards: 60
            };

            const updateResponse = await request(app)
                .put(`/api/indicateurs/${indicateurId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.taux_retard).toBe(updatedData.taux_retard);
            expect(updateResponse.body.taux_presence).toBe(updatedData.taux_presence);
            expect(updateResponse.body.minutes_travaillees).toBe(updatedData.minutes_travaillees);
        });

        it('devrait retourner 404 pour un indicateur inexistant', async () => {
            await request(app)
                .put('/api/indicateurs/999999')
                .send({ taux_retard: '2.0' })
                .expect(404);
        });
    });

    // TEST DELETE : Supprimer un indicateur existant
    describe('DELETE /api/indicateurs/:id', () => {
        it('devrait supprimer un indicateur existant', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'User',
                email: `test.delete.indic.${Date.now()}@example.com`,
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

            const cibleResponse = await request(app)
                .post('/api/cibles-indicateur')
                .send(newCible)
                .expect(201);

            // Créer un indicateur
            const newIndicateur = {
                id_cible_indicateur: cibleResponse.body.id_cible_indicateur,
                date_periode: '2025-06-07'
            };

            const createResponse = await request(app)
                .post('/api/indicateurs')
                .send(newIndicateur)
                .expect(201);

            const indicateurId = createResponse.body.id_indicateur;

            // Supprimer l'indicateur
            await request(app)
                .delete(`/api/indicateurs/${indicateurId}`)
                .expect(204);

            // Vérifier que l'indicateur n'existe plus
            await request(app)
                .put(`/api/indicateurs/${indicateurId}`)
                .send({ taux_retard: '1.0' })
                .expect(404);
        });

        it('devrait retourner 404 pour un indicateur inexistant', async () => {
            await request(app)
                .delete('/api/indicateurs/999999')
                .expect(404);
        });
    });
});
