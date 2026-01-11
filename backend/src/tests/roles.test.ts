import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Roles', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des rôles
    describe('GET /api/roles', () => {
        it('devrait retourner la liste des rôles', async () => {
            const response = await request(app)
                .get('/api/roles')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    // TEST POST : Créer un nouveau rôle
    describe('POST /api/roles', () => {
        it('devrait créer un nouveau rôle', async () => {
            const newRole = {
                titre: `TestRole_${Date.now()}`
            };

            const response = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_role');
            expect(response.body.titre).toBe(newRole.titre);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un rôle avec un titre dupliqué', async () => {
            const titre = `DuplicateRole_${Date.now()}`;

            const role = {
                titre
            };

            // Créer le premier rôle
            await request(app)
                .post('/api/roles')
                .send(role)
                .expect(201);

            // Tenter de créer un doublon
            await request(app)
                .post('/api/roles')
                .send(role)
                .expect(409);
        });

        // Cas de test pour les données manquantes
        it('devrait rejeter un rôle avec des données manquantes', async () => {
            const incompleteRole = {};

            const response = await request(app)
                .post('/api/roles')
                .send(incompleteRole);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un rôle existant
    describe('PUT /api/roles/:id', () => {
        it('devrait mettre à jour un rôle existant', async () => {
            // Créer d'abord un rôle
            const newRole = {
                titre: `BeforeUpdate_${Date.now()}`
            };

            const createResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            const roleId = createResponse.body.id_role;

            // Modifier le rôle
            const updatedData = {
                titre: `AfterUpdate_${Date.now()}`
            };

            const updateResponse = await request(app)
                .put(`/api/roles/${roleId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.titre).toBe(updatedData.titre);
        });

        it('devrait retourner 404 pour un rôle inexistant', async () => {
            await request(app)
                .put('/api/roles/999999')
                .send({ titre: 'TEST' })
                .expect(404);
        });

        it('devrait rejeter la mise à jour avec un titre dupliqué', async () => {
            // Créer deux rôles
            const role1 = {
                titre: `Role1_${Date.now()}`
            };
            const role2 = {
                titre: `Role2_${Date.now()}`
            };

            await request(app)
                .post('/api/roles')
                .send(role1)
                .expect(201);

            const createResponse2 = await request(app)
                .post('/api/roles')
                .send(role2)
                .expect(201);

            const roleId2 = createResponse2.body.id_role;

            // Tenter de mettre à jour role2 avec le titre de role1
            await request(app)
                .put(`/api/roles/${roleId2}`)
                .send({ titre: role1.titre })
                .expect(409);
        });
    });

    // TEST DELETE : Supprimer un rôle existant
    describe('DELETE /api/roles/:id', () => {
        it('devrait supprimer un rôle existant', async () => {
            // Créer d'abord un rôle
            const newRole = {
                titre: `ToDelete_${Date.now()}`
            };

            const createResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            const roleId = createResponse.body.id_role;

            // Supprimer le rôle
            await request(app)
                .delete(`/api/roles/${roleId}`)
                .expect(204);

            // Vérifier que le rôle n'existe plus
            await request(app)
                .put(`/api/roles/${roleId}`)
                .send({ titre: 'TEST' })
                .expect(404);
        });

        it('devrait retourner 404 pour un rôle inexistant', async () => {
            await request(app)
                .delete('/api/roles/999999')
                .expect(404);
        });
    });
});

