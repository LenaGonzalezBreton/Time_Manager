import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Jours Fériés', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des jours fériés
    describe('GET /api/jours-feries', () => {
        it('devrait retourner la liste des jours fériés', async () => {
            const response = await request(app)
                .get('/api/jours-feries')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer un nouveau jour férié
    describe('POST /api/jours-feries', () => {
        it('devrait créer un nouveau jour férié', async () => {
            const newJourFerie = {
                jour_ferie: '2025-12-25' // Noël
            };

            const response = await request(app)
                .post('/api/jours-feries')
                .send(newJourFerie)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_jour_ferie');
            expect(response.body.jour_ferie).toBe(newJourFerie.jour_ferie);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un jour férié avec une date dupliquée', async () => {
            const jourFerie = {
                jour_ferie: '2025-07-14' // Fête nationale
            };

            // Créer le premier jour férié
            await request(app)
                .post('/api/jours-feries')
                .send(jourFerie)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/jours-feries')
                .send(jourFerie)
                .expect(409);
        });

        it('devrait rejeter un jour férié avec des données manquantes', async () => {
            const incompleteJourFerie = {};

            const response = await request(app)
                .post('/api/jours-feries')
                .send(incompleteJourFerie);

            expect([400, 409]).toContain(response.status);
        });

        it('devrait rejeter un jour férié avec une date invalide', async () => {
            const invalidJourFerie = {
                jour_ferie: 'invalid-date'
            };

            const response = await request(app)
                .post('/api/jours-feries')
                .send(invalidJourFerie);

            expect([400, 500]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un jour férié existant
    describe('PUT /api/jours-feries/:id', () => {
        it('devrait mettre à jour un jour férié existant', async () => {
            // Créer d'abord un jour férié
            const newJourFerie = {
                jour_ferie: '2025-08-15' // Assomption
            };

            const createResponse = await request(app)
                .post('/api/jours-feries')
                .send(newJourFerie)
                .expect(201);

            const jourFerieId = createResponse.body.id_jour_ferie;

            // Modifier le jour férié
            const updatedData = {
                jour_ferie: '2025-11-01' // Toussaint
            };

            const updateResponse = await request(app)
                .put(`/api/jours-feries/${jourFerieId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.jour_ferie).toBe(updatedData.jour_ferie);
        });

        it('devrait retourner 404 pour un jour férié inexistant', async () => {
            await request(app)
                .put('/api/jours-feries/999999')
                .send({ jour_ferie: '2025-01-01' })
                .expect(404);
        });

        it('devrait rejeter la mise à jour avec une date dupliquée', async () => {
            // Créer deux jours fériés
            const jourFerie1 = {
                jour_ferie: '2025-05-01' // Fête du travail
            };
            const jourFerie2 = {
                jour_ferie: '2025-05-08' // Victoire 1945
            };

            await request(app)
                .post('/api/jours-feries')
                .send(jourFerie1)
                .expect(201);

            const createResponse2 = await request(app)
                .post('/api/jours-feries')
                .send(jourFerie2)
                .expect(201);

            const jourFerieId2 = createResponse2.body.id_jour_ferie;

            // Tenter de mettre à jour jourFerie2 avec la date de jourFerie1
            await request(app)
                .put(`/api/jours-feries/${jourFerieId2}`)
                .send({ jour_ferie: jourFerie1.jour_ferie })
                .expect(409);
        });
    });

    // TEST DELETE : Supprimer un jour férié existant
    describe('DELETE /api/jours-feries/:id', () => {
        it('devrait supprimer un jour férié existant', async () => {
            // Créer d'abord un jour férié
            const newJourFerie = {
                jour_ferie: '2025-11-11' // Armistice 1918
            };

            const createResponse = await request(app)
                .post('/api/jours-feries')
                .send(newJourFerie)
                .expect(201);

            const jourFerieId = createResponse.body.id_jour_ferie;

            // Supprimer le jour férié
            await request(app)
                .delete(`/api/jours-feries/${jourFerieId}`)
                .expect(204);

            // Vérifier que le jour férié n'existe plus
            await request(app)
                .put(`/api/jours-feries/${jourFerieId}`)
                .send({ jour_ferie: '2025-01-01' })
                .expect(404);
        });

        it('devrait retourner 404 pour un jour férié inexistant', async () => {
            await request(app)
                .delete('/api/jours-feries/999999')
                .expect(404);
        });
    });
});

