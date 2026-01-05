/*import App from '../App.tsx'
import TimerCardPause from '../Components/TimerCardPause.tsx'
import TimerCardInProgress from '../Components/TimerCardInProgress.tsx'
import Collab from '../Components/Collab.tsx'
import Teams from '../Components/Teams.tsx'*/
import NavBar from "../Components/NavBar.tsx"

import Stats from '../Components/Stats.tsx'
import TimerCardDebut from '../Components/TimerCardDebut.tsx'
import Retards from '../Components/Retards.tsx'
import Absences from '../Components/Absences.tsx'


import {Menu, X} from "lucide-react";
import {useState} from "react";
import MonEquipe from "../Components/MonEquipe.tsx";

export default function Dashboard_employé() {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex h-screen w-screen bg-gray-200 relative">
            {/* Bouton menu (mobile seulement) */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-4 left-4 z-50 md:hidden "
            >
                {open ? <X size={24}/> : <Menu size={24}/>}
            </button>

            {/* Overlay sombre (mobile uniquement quand menu ouvert) */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* NAVBAR */}
            <div
                className={`
        fixed top-0 left-0 h-full w-64  // largeur forcée pour mobile
        bg-gray-800 text-white 
        transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-3/10
    `}
            >
                <NavBar/>
            </div>

            {/* CONTENU PRINCIPAL */}
            <main className="flex flex-col p-5 gap-6 h-screen w-full overflow-y-auto justify-between">
                <label className="text-3xl font-semibold text-blue-950 mt-2 items-center">
                    Bonjour Tom Scheffmann !
                </label>

                <div className="flex flex-col md:flex-row items-center md:justify-center gap-10 rounded-xl">
                    <TimerCardDebut/>
                    <Stats/>
                </div>

                <div className="flex flex-col items-center md:flex-row md:gap-20 gap-6 rounded-xl justify-center">
                    <Retards/>
                    <Absences/>
                    <MonEquipe/>
                </div>
            </main>
        </div>
    )
}
