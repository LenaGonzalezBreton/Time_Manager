import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard_manager from './Pages/Dashboard_Manager';
import ProfilUtilisateur from './Components/ProfilUtilisateur';
import ExempleUtilisateurs from './Components/ExempleUtilisateurs';
import Dashboard_employe from './Pages/Dashboard_employé';
import Teams from './Pages/Equipe';
import Calendrier from './Components/Calendrier';

// Le routeur gère les routes de l'application.
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Route de connexion */}
                <Route path="/login" element={<Login/>}/>

                {/* Routes principales */}
                <Route path="/dashboard" element={<Dashboard_employe/>}/>
                <Route path="/profil" element={<ProfilUtilisateur/>}/>
                <Route path="/utilisateurs" element={<ExempleUtilisateurs/>}/>
                <Route path="/equipes" element={<Teams/>}/>
                <Route path="/calendrier" element={<Calendrier/>}/>

                {/* Redirection par défaut vers le dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

                {/* Route 404 - toutes les routes non définies redirigent vers dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;