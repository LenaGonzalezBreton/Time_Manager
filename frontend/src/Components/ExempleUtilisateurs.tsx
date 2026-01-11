import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import utilisateursService from '../services/utilisateurs.service';
import type { Utilisateur } from '../types/utilisateur.types';

/**
 * COMPOSANT EXEMPLE : Liste des utilisateurs
 *
 * PROCESSUS COMPLET :
 * 1. Le composant se charge dans le DOM
 * 2. useEffect() s'exécute automatiquement après le premier rendu
 * 3. On appelle utilisateursService.getAll()
 * 4. Le service fait un appel HTTP GET vers http://localhost:5000/api/utilisateurs
 * 5. Le backend traite la requête et renvoie les données JSON
 * 6. On met à jour l'état React avec setUtilisateurs(data)
 * 7. React re-render le composant avec les nouvelles données
 */
const ExempleUtilisateurs = () => {
  // États React pour gérer les données et l'interface
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect s'exécute au montage du composant (quand il apparaît à l'écran)
  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        setLoading(true);

        // *** APPEL API GET ***
        // Ceci appelle : GET http://localhost:5000/api/utilisateurs
        const data = await utilisateursService.getAll();

        console.log('✅ Données reçues du backend:', data);
        setUtilisateurs(data);
        setError(null);
      } catch (err: any) {
        console.error('❌ Erreur lors de l\'appel API:', err);
        setError(err.response?.data?.message || 'Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchUtilisateurs();
  }, []); // [] = s'exécute une seule fois au montage du composant

  // Affichage conditionnel selon l'état
  if (loading) {
    return <div className="p-4">⏳ Chargement des utilisateurs...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        ❌ Erreur: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📋 Liste des Utilisateurs</h2>
        <Link to="/dashboard" className="flex items-center gap-2 bg-blue-950 text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition">
          <ArrowLeft size={16} />
          Retour
        </Link>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Nombre d'utilisateurs: {utilisateurs.length}
      </p>

      <div className="grid gap-4">
        {utilisateurs.map((user) => (
          <div
            key={user.id_utilisateur}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-lg">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-gray-600">📧 {user.email}</p>
            {user.telephone && (
              <p className="text-gray-500">📱 {user.telephone}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              ID: {user.id_utilisateur} | Role ID: {user.role?.id_role || 'Non défini'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExempleUtilisateurs;

