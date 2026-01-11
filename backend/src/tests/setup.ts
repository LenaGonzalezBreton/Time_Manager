import { AppDataSource } from '../data-source.js';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export const setupTestDatabase = async () => {
    // 1. Créer la BDD si nécessaire
    await createDatabaseIfNotExists();

    // 2. Initialiser TypeORM
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // 3. Migrations (créer tables)
    await AppDataSource.runMigrations();

    // 4. Charger test_data.sql
    await loadTestData();
};

export const teardownTestDatabase = async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
};

export const cleanTestData = async () => {
    // test_data.sql fait TRUNCATE + INSERT, rechargement
    await loadTestData();
};

const createDatabaseIfNotExists = async () => {
    const adminDS = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: process.env.POSTGRES_USER || 'user',
        password: process.env.POSTGRES_PASSWORD || 'password',
        database: 'postgres',
    });

    await adminDS.initialize();
    const dbName = process.env.POSTGRES_DB || 'time_manager_test';
    const exists = await adminDS.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

    if (exists.length === 0) {
        await adminDS.query(`CREATE DATABASE ${dbName}`);
    }

    await adminDS.destroy();
};

const loadTestData = async () => {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'test_data.sql'), 'utf8');
    await AppDataSource.query(sql);
};