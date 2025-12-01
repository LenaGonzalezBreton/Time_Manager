/*import App from '../App.tsx'
import TimerCardPause from '../Components/TimerCardPause.tsx'
import TimerCardInProgress from '../Components/TimerCardInProgress.tsx'
import Collab from '../Components/Collab.tsx'
import Teams from '../Components/Teams.tsx'*/
import NavBar from "../Components/NavBar.tsx"
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Card_employe from "../Components/Card_employé.tsx";
import Card_manager from "../Components/Card_manager.tsx";

export default function Equipe(){

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
                className={`fixed static md:w-2/10  bg-gray-800 text-white transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-10/12"} md:translate-x-0`}
            >
                <NavBar />
            </div>

            <main className="flex flex-col p-2 h-screen w-8/10 overflow-y-auto gap-10">
                <label className="text-3xl font-bold text-blue-950 mt-2 ml-8">
                    Bonjour Tom Scheffmann !
                </label>
                <div className="flex flex-row justify-center gap-2 ">
                    <div className="flex flex-col   w-2/3 p-3 border-black border-2 rounded-2xl">
                        <h2 className="text-2xl font-bold text-blue-950 mb-4">Mon Equipe</h2>
                        <Card_employe/>
                        <Card_employe/>
                        <Card_employe/>
                        <Card_employe/>
                        <Card_employe/>
                        <Card_employe/>
                        <Card_employe/>
                        </div>
                    <div className="w-1/3"> <Card_manager/></div>
                </div>
            </main>


        </div>
    )
}