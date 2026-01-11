import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source.js';
import { Utilisateur } from './entities/Utilisateur.js';

/**
 * Script de migration pour hasher les mots de passe existants
 * 
 * Ce script parcourt tous les utilisateurs et hash leurs mots de passe
 * s'ils ne sont pas déjà hashés avec bcrypt.
 * 
 * Usage: ts-node --esm migrate-passwords.ts
 */

async function migratePasswords() {
    console.log('🔐 Démarrage de la migration des mots de passe...\n');

    try {
        // Initialiser la connexion à la base de données
        await AppDataSource.initialize();
        console.log('✅ Connexion à la base de données établie\n');

        // Récupérer tous les utilisateurs
        const userRepository = AppDataSource.getRepository(Utilisateur);
        const users = await userRepository.find();

        console.log(`📊 ${users.length} utilisateur(s) trouvé(s)\n`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            // Vérifier si le mot de passe est déjà hashé avec bcrypt
            // Les hashes bcrypt commencent par $2a$, $2b$, ou $2y$
            const isBcryptHash = /^\$2[aby]\$/.test(user.mot_de_passe);

            if (isBcryptHash) {
                console.log(`⏭️  ${user.email} - Mot de passe déjà hashé, ignoré`);
                skippedCount++;
                continue;
            }

            // Hasher le mot de passe
            const originalPassword = user.mot_de_passe;
            const hashedPassword = await bcrypt.hash(originalPassword, 10);

            // Mettre à jour l'utilisateur
            user.mot_de_passe = hashedPassword;
            await userRepository.save(user);

            console.log(`✅ ${user.email} - Mot de passe hashé avec succès`);
            console.log(`   Original: ${originalPassword.substring(0, 10)}...`);
            console.log(`   Hash: ${hashedPassword.substring(0, 30)}...\n`);

            migratedCount++;
        }

        console.log('\n' + '='.repeat(60));
        console.log('📈 Résumé de la migration:');
        console.log(`   ✅ Mots de passe migrés: ${migratedCount}`);
        console.log(`   ⏭️  Déjà hashés (ignorés): ${skippedCount}`);
        console.log(`   📊 Total: ${users.length}`);
        console.log('='.repeat(60) + '\n');

        // Fermer la connexion
        await AppDataSource.destroy();
        console.log('✅ Migration terminée avec succès!\n');

    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

// Exécuter la migration
migratePasswords();
