import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import ProfilUtilisateur from './Components/ProfilUtilisateur';
import UtilisateursPage from './Pages/Utilisateurs';
import Dashboard_employe from './Pages/Dashboard_employé';
import Teams from './Pages/Equipe';
import GestionEquipes from './Pages/GestionEquipes';
import CalendrierPage from './Pages/Calendrier';
import ProtectedRoute from './Components/ProtectedRoute';
import Statistiques from './Pages/Statistiques';
import Parametres from './Pages/Parametres';
import Historique from './Pages/Historique';

// Le routeur gère les routes de l'application.
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Route de connexion - publique */}
                <Route path="/login" element={<Login />} />

                {/* Routes protégées - authentification requise */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard_employe />
                    </ProtectedRoute>
                } />
                <Route path="/profil" element={
                    <ProtectedRoute>
                        <ProfilUtilisateur />
                    </ProtectedRoute>
                } />
                <Route path="/utilisateurs" element={
                    <ProtectedRoute requireManager={true}>
                        <UtilisateursPage />
                    </ProtectedRoute>
                } />
                <Route path="/gestion-equipes" element={
                    <ProtectedRoute requireManager={true}>
                        <GestionEquipes />
                    </ProtectedRoute>
                } />
                <Route path="/equipes" element={
                    <ProtectedRoute>
                        <Teams />
                    </ProtectedRoute>
                } />
                <Route path="/calendrier" element={
                    <ProtectedRoute>
                        <CalendrierPage />
                    </ProtectedRoute>
                } />
                <Route path="/statistiques" element={
                    <ProtectedRoute>
                        <Statistiques />
                    </ProtectedRoute>
                } />
                <Route path="/parametres" element={
                    <ProtectedRoute>
                        <Parametres />
                    </ProtectedRoute>
                } />
                <Route path="/historique" element={
                    <ProtectedRoute requireManager={true}>
                        <Historique />
                    </ProtectedRoute>
                } />

                {/* Redirection par défaut vers le dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Route 404 - toutes les routes non définies redirigent vers dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;