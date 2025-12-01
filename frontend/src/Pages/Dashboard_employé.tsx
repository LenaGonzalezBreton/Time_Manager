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


import { Menu, X } from "lucide-react";
import { useState } from "react";
import MonEquipe from "../Components/MonEquipe.tsx";

export default function Dashboard_employé(){const [open, setOpen] = useState(false);
    return(
        <div className="flex h-screen w-screen bg-gray-200 relative">
            {/* Bouton menu (mobile seulement) */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-4 left-4 z-50 md:hidden "
            >
                {open ? <X size={24} /> : <Menu size={24} />}
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
                className={`fixed static md:w-3/10  bg-gray-800 text-white transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-10/12"} md:translate-x-0`}
            >
                <NavBar />
            </div>

            {/* CONTENU PRINCIPAL */}
            <main className="flex flex-col p-5 h-screen w-full overflow-y-auto justify-between">
                <label className="text-3xl font-bold text-blue-950 mt-2 ml-8">
                    Bonjour Tom Scheffmann !
                </label>

                <div className="flex flex-row justify-center gap-10 rounded-xl">
                    <TimerCardDebut/>
                    <Stats/>
                </div>

                <div className="flex flex-row gap-20 rounded-xl justify-center">
                    <Retards/>
                    <Absences/>
                    <MonEquipe/>
                </div>
            </main>
        </div>
    )
}