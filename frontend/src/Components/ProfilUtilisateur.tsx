import { useState, useEffect } from 'react';
import utilisateursService from '../services/utilisateurs.service';
import type { Utilisateur } from '../types/utilisateur.types';

/**
 * EXEMPLE : Afficher les données d'un utilisateur connecté
 *
 * Pour simuler un utilisateur connecté, on utilise un ID stocké dans localStorage
 * Plus tard, cet ID viendra du système d'authentification (JWT token, session, etc.)
 */
const ProfilUtilisateur = () => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilUtilisateur = async () => {
      try {
        setLoading(true);

        // 🔹 SIMULATION : ID de l'utilisateur connecté
        // En production, cet ID viendrait de votre système d'authentification
        const userId = localStorage.getItem('currentUserId') || '1'; // Par défaut utilisateur ID 1

        console.log(`🔍 Récupération du profil utilisateur ID: ${userId}`);

        // *** APPEL API : GET /api/utilisateurs/:id ***
        const data = await utilisateursService.getById(parseInt(userId));

        console.log('✅ Profil utilisateur récupéré:', data);
        setUtilisateur(data);
        setError(null);
      } catch (err: any) {
        console.error('❌ Erreur:', err);
        setError(err.response?.data?.message || 'Impossible de charger le profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfilUtilisateur();
  }, []);

  // Fonction pour changer d'utilisateur (pour tester)
  const changerUtilisateur = (newId: number) => {
    localStorage.setItem('currentUserId', newId.toString());
    window.location.reload(); // Recharger pour simuler une nouvelle connexion
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="text-2xl mb-2">⏳</div>
                <p>Chargement du profil...</p>
            </div>
      </div>
    );
  }

  if (error || !utilisateur) {
    return (
      <div className="p-4 max-w-md mx-auto mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p className="font-bold">❌ Erreur</p>
          <p>{error || 'Utilisateur non trouvé'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête avec informations utilisateur */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              👤 Mon Profil
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              ID: {utilisateur.id_utilisateur}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                📋 Informations personnelles
              </h2>

              <div className="space-y-3">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="text-lg font-semibold">
                    {utilisateur.prenom} {utilisateur.nom}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg">📧 {utilisateur.email}</p>
                </div>

                {utilisateur.telephone && (
                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-lg">📱 {utilisateur.telephone}</p>
                  </div>
                )}

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p className="text-lg">
                    🎭 {utilisateur.role?.nom || `ID: ${utilisateur.role?.id_role || 'Non défini'}`}
                  </p>
                </div>

                {utilisateur.equipe && utilisateur.equipe.length > 0 && (
                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Équipe(s)</p>
                    <div className="space-y-1">
                      {utilisateur.equipe.map((eq, index) => (
                        <p key={index} className="text-lg">
                          👥 {eq.nom} (ID: {eq.id_equipe})
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                ⚡ Actions rapides
              </h2>

              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  ✏️ Modifier mon profil
                </button>
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
                  🕒 Pointer mon arrivée
                </button>
                <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition">
                  📅 Voir mes horaires
                </button>
                <button className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition">
                  🏖️ Demander une absence
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de test - Changer d'utilisateur */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">🧪 Zone de test</h3>
          <p className="text-sm text-gray-600 mb-3">
            Simuler la connexion d'un autre utilisateur :
          </p>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map(id => (
              <button
                key={id}
                onClick={() => changerUtilisateur(id)}
                className={`px-4 py-2 rounded ${
                  utilisateur.id_utilisateur === id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Utilisateur {id}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 En production, l'ID viendra du token JWT après authentification
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilUtilisateur;

