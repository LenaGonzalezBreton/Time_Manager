import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Components/Login.tsx'
import SignIn from './Components/SignIn.tsx'
import NavBar from './Components/NavBar.tsx'
import TimerCardInProgress from './Components/TimerCardInProgress.tsx'
import Collab from './Components/Collab.tsx'
import Teams from './Components/Teams.tsx'
import Stats from './Components/Stats.tsx'
import Dashboard_employe from './Pages/Dashboard_employe.tsx';
import TimerCardDebut from "./Components/TimerCardDebut.tsx";
import TimerCardPause from "./Components/TimerCardPause.tsx";
import Calendrier from "./Components/Calendrier.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Dashboard_employe/>
  </StrictMode>
)
