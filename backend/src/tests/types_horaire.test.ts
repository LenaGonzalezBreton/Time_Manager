import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Types Horaire', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des types d'horaire
    describe('GET /api/types-horaire', () => {
        it('devrait retourner la liste des types d\'horaire', async () => {
            const response = await request(app)
                .get('/api/types-horaire')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer un nouveau type d'horaire
    describe('POST /api/types-horaire', () => {
        it('devrait créer un nouveau type d\'horaire', async () => {
            const newTypeHoraire = {
                type: `TypeHoraire_${Date.now()}`
            };

            const response = await request(app)
                .post('/api/types-horaire')
                .send(newTypeHoraire)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_type_horaire');
            expect(response.body.type).toBe(newTypeHoraire.type);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un type d\'horaire avec un type dupliqué', async () => {
            const type = `TypeHoraireDuplicate_${Date.now()}`;

            const typeHoraire = {
                type
            };

            // Créer le premier type
            await request(app)
                .post('/api/types-horaire')
                .send(typeHoraire)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/types-horaire')
                .send(typeHoraire)
                .expect(409);
        });

        it('devrait rejeter un type d\'horaire avec des données manquantes', async () => {
            const incompleteTypeHoraire = {};

            const response = await request(app)
                .post('/api/types-horaire')
                .send(incompleteTypeHoraire);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un type d'horaire existant
    describe('PUT /api/types-horaire/:id', () => {
        it('devrait mettre à jour un type d\'horaire existant', async () => {
            // Créer d'abord un type d'horaire
            const newTypeHoraire = {
                type: `TypeHoraireAvant_${Date.now()}`
            };

            const createResponse = await request(app)
                .post('/api/types-horaire')
                .send(newTypeHoraire)
                .expect(201);

            const typeHoraireId = createResponse.body.id_type_horaire;

            // Modifier le type d'horaire
            const updatedData = {
                type: `TypeHoraireApres_${Date.now()}`
            };

            const updateResponse = await request(app)
                .put(`/api/types-horaire/${typeHoraireId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.type).toBe(updatedData.type);
        });

        it('devrait retourner 404 pour un type d\'horaire inexistant', async () => {
            await request(app)
                .put('/api/types-horaire/999999')
                .send({ type: 'TEST' })
                .expect(404);
        });

        it('devrait rejeter la mise à jour avec un type dupliqué', async () => {
            // Créer deux types d'horaire
            const type1 = {
                type: `TypeHoraire1_${Date.now()}`
            };
            const type2 = {
                type: `TypeHoraire2_${Date.now()}`
            };

            await request(app)
                .post('/api/types-horaire')
                .send(type1)
                .expect(201);

            const createResponse2 = await request(app)
                .post('/api/types-horaire')
                .send(type2)
                .expect(201);

            const typeHoraireId2 = createResponse2.body.id_type_horaire;

            // Tenter de mettre à jour type2 avec le type de type1
            await request(app)
                .put(`/api/types-horaire/${typeHoraireId2}`)
                .send({ type: type1.type })
                .expect(409);
        });
    });

    // TEST DELETE : Supprimer un type d'horaire existant
    describe('DELETE /api/types-horaire/:id', () => {
        it('devrait supprimer un type d\'horaire existant', async () => {
            // Créer d'abord un type d'horaire
            const newTypeHoraire = {
                type: `TypeHoraireSupprimer_${Date.now()}`
            };

            const createResponse = await request(app)
                .post('/api/types-horaire')
                .send(newTypeHoraire)
                .expect(201);

            const typeHoraireId = createResponse.body.id_type_horaire;

            // Supprimer le type d'horaire
            await request(app)
                .delete(`/api/types-horaire/${typeHoraireId}`)
                .expect(204);

            // Vérifier que le type d'horaire n'existe plus
            await request(app)
                .put(`/api/types-horaire/${typeHoraireId}`)
                .send({ type: 'TEST' })
                .expect(404);
        });

        it('devrait retourner 404 pour un type d\'horaire inexistant', async () => {
            await request(app)
                .delete('/api/types-horaire/999999')
                .expect(404);
        });
    });
});

