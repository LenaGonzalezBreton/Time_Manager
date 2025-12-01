import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Pages/Login.tsx'
import SignIn from './Pages/SignIn.tsx'
import NavBar from './Components/NavBar.tsx'
import TimerCardInProgress from './Components/TimerCardInProgress.tsx'
import Collab from './Components/Collab.tsx'
import Teams from './Components/Teams.tsx'
import Stats from './Components/Stats.tsx'
import Dashboard_manager_DebutDeJournee from './Pages/Dashboard_manager_DebutDeJournee(inutile à priori).tsx';
import TimerCardDebut from "./Components/TimerCardDebut.tsx";
import TimerCardPause from "./Components/TimerCardPause.tsx";
import Calendrier from "./Components/Calendrier.tsx";
import Absences from "./Components/Absences.tsx";
import Retards from "./Components/Retards.tsx";
import Dashboard_employé from "./Pages/Dashboard_employé.tsx";
import MonEquipe from "./Components/MonEquipe.tsx";
import Equipe from "./Pages/Equipe.tsx"
import Dashboard_manager_journee from "./Pages/Dashboard_Manager.tsx";
import Card_employe from "./Components/Card_employé.tsx";
import Card_manager from "./Components/Card_manager.tsx";
import Dashboard_manager from "./Pages/Dashboard_Manager.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Dashboard_employé/>
    </StrictMode>
)
