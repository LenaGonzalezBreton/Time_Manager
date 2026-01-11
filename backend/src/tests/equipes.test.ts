import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Equipes', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des équipes
    describe('GET /api/equipes', () => {
        it('devrait retourner la liste des équipes', async () => {
            const response = await request(app)
                .get('/api/equipes')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer une nouvelle équipe
    describe('POST /api/equipes', () => {
        it('devrait créer une nouvelle équipe', async () => {
            const newEquipe = {
                nom: `Equipe_${Date.now()}`,
                description: 'Une équipe de test'
            };

            const response = await request(app)
                .post('/api/equipes')
                .send(newEquipe)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_equipe');
            expect(response.body.nom).toBe(newEquipe.nom);
            expect(response.body.description).toBe(newEquipe.description);
        });

        it('devrait créer une équipe sans description', async () => {
            const newEquipe = {
                nom: `Equipe_${Date.now()}`
            };

            const response = await request(app)
                .post('/api/equipes')
                .send(newEquipe)
                .expect(201);

            expect(response.body).toHaveProperty('id_equipe');
            expect(response.body.nom).toBe(newEquipe.nom);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter une équipe avec un nom dupliqué', async () => {
            const nom = `EquipeDuplicate_${Date.now()}`;

            const equipe = {
                nom,
                description: 'Première équipe'
            };

            // Créer la première équipe
            await request(app)
                .post('/api/equipes')
                .send(equipe)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/equipes')
                .send(equipe)
                .expect(409);
        });

        it('devrait rejeter une équipe avec des données manquantes', async () => {
            const incompleteEquipe = {
                description: 'Description sans nom'
            };

            const response = await request(app)
                .post('/api/equipes')
                .send(incompleteEquipe);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour une équipe existante
    describe('PUT /api/equipes/:id', () => {
        it('devrait mettre à jour une équipe existante', async () => {
            // Créer d'abord une équipe
            const newEquipe = {
                nom: `EquipeAvant_${Date.now()}`,
                description: 'Avant modification'
            };

            const createResponse = await request(app)
                .post('/api/equipes')
                .send(newEquipe)
                .expect(201);

            const equipeId = createResponse.body.id_equipe;

            // Modifier l'équipe
            const updatedData = {
                nom: `EquipeApres_${Date.now()}`,
                description: 'Après modification'
            };

            const updateResponse = await request(app)
                .put(`/api/equipes/${equipeId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.nom).toBe(updatedData.nom);
            expect(updateResponse.body.description).toBe(updatedData.description);
        });

        it('devrait retourner 404 pour une équipe inexistante', async () => {
            await request(app)
                .put('/api/equipes/999999')
                .send({ nom: 'TEST' })
                .expect(404);
        });

        it('devrait rejeter la mise à jour avec un nom dupliqué', async () => {
            // Créer deux équipes
            const equipe1 = {
                nom: `Equipe1_${Date.now()}`
            };
            const equipe2 = {
                nom: `Equipe2_${Date.now()}`
            };

            await request(app)
                .post('/api/equipes')
                .send(equipe1)
                .expect(201);

            const createResponse2 = await request(app)
                .post('/api/equipes')
                .send(equipe2)
                .expect(201);

            const equipeId2 = createResponse2.body.id_equipe;

            // Tenter de mettre à jour equipe2 avec le nom d'equipe1
            await request(app)
                .put(`/api/equipes/${equipeId2}`)
                .send({ nom: equipe1.nom })
                .expect(409);
        });
    });

    // TEST DELETE : Supprimer une équipe existante
    describe('DELETE /api/equipes/:id', () => {
        it('devrait supprimer une équipe existante', async () => {
            // Créer d'abord une équipe
            const newEquipe = {
                nom: `EquipeSupprimer_${Date.now()}`,
                description: 'Équipe à supprimer'
            };

            const createResponse = await request(app)
                .post('/api/equipes')
                .send(newEquipe)
                .expect(201);

            const equipeId = createResponse.body.id_equipe;

            // Supprimer l'équipe
            await request(app)
                .delete(`/api/equipes/${equipeId}`)
                .expect(204);

            // Vérifier que l'équipe n'existe plus
            await request(app)
                .put(`/api/equipes/${equipeId}`)
                .send({ nom: 'TEST' })
                .expect(404);
        });

        it('devrait retourner 404 pour une équipe inexistante', async () => {
            await request(app)
                .delete('/api/equipes/999999')
                .expect(404);
        });
    });
});

