import request from 'supertest';
import app from '../app.js';
import { cleanTestData } from './setup.js';

describe('Tests API Rapports', () => {
    // Nettoyer les données entre chaque test pour garantir l'isolation
    beforeEach(async () => {
        await cleanTestData();
    });

    // TEST GET : Récupérer des rapports
    describe('GET /api/rapports', () => {
        it('devrait retourner un rapport vide pour un utilisateur sans données', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'Rapport',
                email: `test.rapport.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            const userId = userResponse.body.id_utilisateur;

            // Récupérer le rapport pour cet utilisateur
            const response = await request(app)
                .get('/api/rapports')
                .query({
                    userId: userId,
                    startDate: '2025-01-01',
                    endDate: '2025-01-31'
                })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toBeDefined();
        });

        it('devrait retourner un rapport pour un utilisateur avec des indicateurs', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'Rapport',
                email: `test.rapport.indic.${Date.now()}@example.com`,
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

            // Créer un indicateur
            const newIndicateur = {
                id_cible_indicateur: cibleResponse.body.id_cible_indicateur,
                date_periode: '2025-01-15',
                taux_retard: '3.5',
                taux_presence: '96.5',
                minutes_travaillees: 480,
                minutes_retards: 15
            };

            await request(app)
                .post('/api/indicateurs')
                .send(newIndicateur)
                .expect(201);

            // Récupérer le rapport
            const response = await request(app)
                .get('/api/rapports')
                .query({
                    userId: userId,
                    startDate: '2025-01-01',
                    endDate: '2025-01-31',
                    granularity: 'summary'
                })
                .expect(200);

            expect(response.body).toBeDefined();
        });

        it('devrait retourner un rapport pour une équipe', async () => {
            // Créer une équipe
            const newEquipe = {
                nom: `EquipeRapport_${Date.now()}`,
                description: 'Équipe pour test rapport'
            };

            const equipeResponse = await request(app)
                .post('/api/equipes')
                .send(newEquipe)
                .expect(201);

            const equipeId = equipeResponse.body.id_equipe;

            // Récupérer le rapport pour cette équipe
            const response = await request(app)
                .get('/api/rapports')
                .query({
                    teamId: equipeId,
                    startDate: '2025-01-01',
                    endDate: '2025-01-31'
                })
                .expect(200);

            expect(response.body).toBeDefined();
        });

        it('devrait filtrer les rapports par KPIs spécifiques', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'KPI',
                email: `test.kpi.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Récupérer le rapport avec des KPIs spécifiques
            const response = await request(app)
                .get('/api/rapports')
                .query({
                    userId: userResponse.body.id_utilisateur,
                    startDate: '2025-01-01',
                    endDate: '2025-01-31',
                    kpis: 'taux_presence,minutes_travaillees'
                })
                .expect(200);

            expect(response.body).toBeDefined();
        });

        it('devrait retourner un rapport avec granularité journalière', async () => {
            // Créer un utilisateur
            const newUser = {
                nom: 'TEST',
                prenom: 'Daily',
                email: `test.daily.${Date.now()}@example.com`,
                telephone: '0612345678',
                mot_de_passe: 'password123',
                roleIdRole: 1
            };

            const userResponse = await request(app)
                .post('/api/utilisateurs')
                .send(newUser)
                .expect(201);

            // Récupérer le rapport avec granularité journalière
            const response = await request(app)
                .get('/api/rapports')
                .query({
                    userId: userResponse.body.id_utilisateur,
                    startDate: '2025-01-01',
                    endDate: '2025-01-31',
                    granularity: 'daily'
                })
                .expect(200);

            expect(response.body).toBeDefined();
        });

        it('devrait rejeter une requête avec userId et teamId simultanés', async () => {
            const response = await request(app)
                .get('/api/rapports')
                .query({
                    userId: 1,
                    teamId: 1,
                    startDate: '2025-01-01',
                    endDate: '2025-01-31'
                });

            expect([400, 409]).toContain(response.status);
        });
    });

    // TEST POST : Recalcul des rapports (si implémenté)
    describe('POST /api/rapports/recalcul', () => {
        it('devrait déclencher un recalcul des indicateurs', async () => {
            const response = await request(app)
                .post('/api/rapports/recalcul')
                .send({})
                .expect('Content-Type', /json/);

            // Le statut peut varier selon l'implémentation (200, 201, 202)
            expect([200, 201, 202]).toContain(response.status);
        });
    });
});

