/*import App from '../App.tsx'
import Login from '../Components/Login.tsx'
import SignIn from '../Components/SignIn.tsx'
import TimerCardDebut from '../Components/TimerCardDebut.tsx'
import TimerCardPause from '../Components/TimerCardPause.tsx' */
import NavBar from "../Components/NavBar.tsx"
import TimerCardInProgress from '../Components/TimerCardInProgress.tsx'
import Collab from '../Components/Collab.tsx'
import Teams from '../Components/Teams.tsx'
import Stats from '../Components/Stats.tsx'

import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Dashboard_manager_DebutDeJournee(){

    const [open, setOpen] = useState(false);
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
            <main className=" flex flex-col p-5 h-full w-full justify-between">
                <label className="text-4xl font-bold text-blue-950 mt-2 ml-8 mb-6">
                    Bonjour Tom Scheffmann !
                </label>

                <div className="flex flex-row justify-center gap-50 rounded-xl mb-6">
                    <TimerCardInProgress/>
                    <Stats/>
                </div>

                <div className="flex flex-col items-center rounded-xl gap-6 ">
                    <Collab/>
                    <Teams/>
                </div>
            </main>
        </div>
    )
}