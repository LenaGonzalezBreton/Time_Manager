import request from 'supertest';
import app from '../app';
import { cleanTestData } from './setup';

describe('Tests API Types Absence', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des types d'absence
    describe('GET /api/types-absence', () => {
        it('devrait retourner la liste des types d\'absence', async () => {
            const response = await request(app)
                .get('/api/types-absence')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer un nouveau type d'absence
    describe('POST /api/types-absence', () => {
        it('devrait créer un nouveau type d\'absence', async () => {
            const newTypeAbsence = {
                type: `TypeAbsence_${Date.now()}`
            };

            const response = await request(app)
                .post('/api/types-absence')
                .send(newTypeAbsence)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_type_absence');
            expect(response.body.type).toBe(newTypeAbsence.type);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un type d\'absence avec un type dupliqué', async () => {
            const type = `TypeDuplicate_${Date.now()}`;

            const typeAbsence = {
                type
            };

            // Créer le premier type
            await request(app)
                .post('/api/types-absence')
                .send(typeAbsence)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/types-absence')
                .send(typeAbsence)
                .expect(409);
        });

        it('devrait rejeter un type d\'absence avec des données manquantes', async () => {
            const incompleteTypeAbsence = {};

            const response = await request(app)
                .post('/api/types-absence')
                .send(incompleteTypeAbsence);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un type d'absence existant
    describe('PUT /api/types-absence/:id', () => {
        it('devrait mettre à jour un type d\'absence existant', async () => {
            // Créer d'abord un type d'absence
            const newTypeAbsence = {
                type: `TypeAvant_${Date.now()}`
            };

            const createResponse = await request(app)
                .post('/api/types-absence')
                .send(newTypeAbsence)
                .expect(201);

            const typeAbsenceId = createResponse.body.id_type_absence;

            // Modifier le type d'absence
            const updatedData = {
                type: `TypeApres_${Date.now()}`
            };

            const updateResponse = await request(app)
                .put(`/api/types-absence/${typeAbsenceId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.type).toBe(updatedData.type);
        });

        it('devrait retourner 404 pour un type d\'absence inexistant', async () => {
            await request(app)
                .put('/api/types-absence/999999')
                .send({ type: 'TEST' })
                .expect(404);
        });

        it('devrait rejeter la mise à jour avec un type dupliqué', async () => {
            // Créer deux types d'absence
            const type1 = {
                type: `Type1_${Date.now()}`
            };
            const type2 = {
                type: `Type2_${Date.now()}`
            };

            await request(app)
                .post('/api/types-absence')
                .send(type1)
                .expect(201);

            const createResponse2 = await request(app)
                .post('/api/types-absence')
                .send(type2)
                .expect(201);

            const typeAbsenceId2 = createResponse2.body.id_type_absence;

            // Tenter de mettre à jour type2 avec le type de type1
            await request(app)
                .put(`/api/types-absence/${typeAbsenceId2}`)
                .send({ type: type1.type })
                .expect(409);
        });
    });

    // TEST DELETE : Supprimer un type d'absence existant
    describe('DELETE /api/types-absence/:id', () => {
        it('devrait supprimer un type d\'absence existant', async () => {
            // Créer d'abord un type d'absence
            const newTypeAbsence = {
                type: `TypeSupprimer_${Date.now()}`
            };

            const createResponse = await request(app)
                .post('/api/types-absence')
                .send(newTypeAbsence)
                .expect(201);

            const typeAbsenceId = createResponse.body.id_type_absence;

            // Supprimer le type d'absence
            await request(app)
                .delete(`/api/types-absence/${typeAbsenceId}`)
                .expect(204);

            // Vérifier que le type d'absence n'existe plus
            await request(app)
                .put(`/api/types-absence/${typeAbsenceId}`)
                .send({ type: 'TEST' })
                .expect(404);
        });

        it('devrait retourner 404 pour un type d\'absence inexistant', async () => {
            await request(app)
                .delete('/api/types-absence/999999')
                .expect(404);
        });
    });
});

