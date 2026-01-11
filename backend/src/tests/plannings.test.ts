import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Plannings', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer la liste des plannings
    describe('GET /api/plannings', () => {
        it('devrait retourner la liste des plannings', async () => {
            const response = await request(app)
                .get('/api/plannings')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // TEST POST : Créer un nouveau planning
    describe('POST /api/plannings', () => {
        it('devrait créer un nouveau planning', async () => {
            // Créer d'abord un rôle pour le planning
            const newRole = {
                titre: `RolePlanning_${Date.now()}`
            };

            const roleResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            const roleId = roleResponse.body.id_role;

            // Créer le planning
            const newPlanning = {
                id_role: roleId,
                jour_semaine: 'Lundi',
                heure_arrivee: '08:00:00',
                heure_pause: '12:00:00',
                heure_depart: '17:00:00',
                jour_travail: true
            };

            const response = await request(app)
                .post('/api/plannings')
                .send(newPlanning)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toHaveProperty('id_planning');
            expect(response.body.jour_semaine).toBe(newPlanning.jour_semaine);
            expect(response.body.heure_arrivee).toBe(newPlanning.heure_arrivee);
            expect(response.body.jour_travail).toBe(newPlanning.jour_travail);
        });

        it('devrait créer un planning avec des heures nulles', async () => {
            // Créer un rôle
            const newRole = {
                titre: `RolePlanningNull_${Date.now()}`
            };

            const roleResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            // Créer un planning sans heures (jour non travaillé)
            const newPlanning = {
                id_role: roleResponse.body.id_role,
                jour_semaine: 'Samedi',
                heure_arrivee: null,
                heure_pause: null,
                heure_depart: null,
                jour_travail: false
            };

            const response = await request(app)
                .post('/api/plannings')
                .send(newPlanning)
                .expect(201);

            expect(response.body).toHaveProperty('id_planning');
            expect(response.body.jour_travail).toBe(false);
        });

        // Cas de test pour les erreurs
        it('devrait rejeter un planning avec un rôle invalide', async () => {
            const invalidPlanning = {
                id_role: 999999, // Rôle inexistant
                jour_semaine: 'Mardi',
                heure_arrivee: '08:00:00'
            };

            await request(app)
                .post('/api/plannings')
                .send(invalidPlanning)
                .expect(400);
        });

        it('devrait rejeter un planning avec un jour invalide', async () => {
            // Créer un rôle
            const newRole = {
                titre: `RoleInvalidDay_${Date.now()}`
            };

            const roleResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            const invalidPlanning = {
                id_role: roleResponse.body.id_role,
                jour_semaine: 'InvalidDay', // Jour invalide
                heure_arrivee: '08:00:00'
            };

            const response = await request(app)
                .post('/api/plannings')
                .send(invalidPlanning);

            expect([400, 500]).toContain(response.status);
        });

        it('devrait rejeter un planning avec des données manquantes', async () => {
            const incompletePlanning = {
                jour_semaine: 'Mercredi'
                // id_role manquant
            };

            const response = await request(app)
                .post('/api/plannings')
                .send(incompletePlanning);

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST PUT : Mettre à jour un planning existant
    describe('PUT /api/plannings/:id', () => {
        it('devrait mettre à jour un planning existant', async () => {
            // Créer un rôle
            const newRole = {
                titre: `RoleUpdatePlanning_${Date.now()}`
            };

            const roleResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            // Créer un planning
            const newPlanning = {
                id_role: roleResponse.body.id_role,
                jour_semaine: 'Jeudi',
                heure_arrivee: '08:00:00',
                heure_depart: '17:00:00',
                jour_travail: true
            };

            const createResponse = await request(app)
                .post('/api/plannings')
                .send(newPlanning)
                .expect(201);

            const planningId = createResponse.body.id_planning;

            // Modifier le planning
            const updatedData = {
                heure_arrivee: '09:00:00',
                heure_depart: '18:00:00'
            };

            const updateResponse = await request(app)
                .put(`/api/plannings/${planningId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body.heure_arrivee).toBe(updatedData.heure_arrivee);
            expect(updateResponse.body.heure_depart).toBe(updatedData.heure_depart);
        });

        it('devrait mettre à jour un planning pour définir un jour non travaillé', async () => {
            // Créer un rôle
            const newRole = {
                titre: `RoleNoWork_${Date.now()}`
            };

            const roleResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            // Créer un planning
            const newPlanning = {
                id_role: roleResponse.body.id_role,
                jour_semaine: 'Vendredi',
                heure_arrivee: '08:00:00',
                jour_travail: true
            };

            const createResponse = await request(app)
                .post('/api/plannings')
                .send(newPlanning)
                .expect(201);

            const planningId = createResponse.body.id_planning;

            // Modifier pour mettre jour_travail à false
            const updateResponse = await request(app)
                .put(`/api/plannings/${planningId}`)
                .send({ jour_travail: false })
                .expect(200);

            expect(updateResponse.body.jour_travail).toBe(false);
        });

        it('devrait retourner 404 pour un planning inexistant', async () => {
            await request(app)
                .put('/api/plannings/999999')
                .send({ heure_arrivee: '08:00:00' })
                .expect(404);
        });
    });

    // TEST DELETE : Supprimer un planning existant
    describe('DELETE /api/plannings/:id', () => {
        it('devrait supprimer un planning existant', async () => {
            // Créer un rôle
            const newRole = {
                titre: `RoleDeletePlanning_${Date.now()}`
            };

            const roleResponse = await request(app)
                .post('/api/roles')
                .send(newRole)
                .expect(201);

            // Créer un planning
            const newPlanning = {
                id_role: roleResponse.body.id_role,
                jour_semaine: 'Dimanche',
                jour_travail: false
            };

            const createResponse = await request(app)
                .post('/api/plannings')
                .send(newPlanning)
                .expect(201);

            const planningId = createResponse.body.id_planning;

            // Supprimer le planning
            await request(app)
                .delete(`/api/plannings/${planningId}`)
                .expect(204);

            // Vérifier que le planning n'existe plus
            await request(app)
                .put(`/api/plannings/${planningId}`)
                .send({ jour_travail: true })
                .expect(404);
        });

        it('devrait retourner 404 pour un planning inexistant', async () => {
            await request(app)
                .delete('/api/plannings/999999')
                .expect(404);
        });
    });
});
