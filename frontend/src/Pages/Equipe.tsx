/*import App from '../App.tsx'
import TimerCardPause from '../Components/TimerCardPause.tsx'
import TimerCardInProgress from '../Components/TimerCardInProgress.tsx'
import Collab from '../Components/Collab.tsx'
import Teams from '../Components/Teams.tsx'*/
import NavBar from "../Components/NavBar.tsx"
import { Menu, X } from "lucide-react";
import { useState } from "react";


export default function Equipe(){

    const [open, setOpen] = useState(false);
    return(
        <div className="flex min-h-screen w-max bg-gray-200 relative">
            {/* Bouton menu (mobile seulement) */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-4 left-4 z-50 md:hidden"
            >
                {open ? <X size={24}/> : <Menu size={24}/>}
            </button>

            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* NAVBAR */}
            <div
                className={`fixed md:static left-0 w-2/5 md:w-1/4 bg-gray-800 text-white z-50 transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <NavBar/>
            </div>

            <div className="bg-gray-100 gap-5 p-6">
                <p className=" text-xl font-bold text-gray-700 mb-10">Bonjour, [Prénom] !</p>
                <div className="flex flex-row gap-5 ">
                    <div className="rounded-2xl border-black justify-between border-2 p-3">
                        <h2 className="text-xl font-bold text-blue-950 mb-4">Mon équipe</h2>
                        <div className="flex items-center border-2 border-black p-3 rounded-lg hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <img className="w-15 h-10 rounded-full bg-white border-2 border-gray-500"/>
                            <div>
                                <p className="font-medium text-gray-800">Nom</p>
                                <p className="text-sm text-gray-500">email@domaine.com|06.00.00.00.00</p>
                            </div>
                            </div>
                            <div className="text-gray-600 text-sm"> Poste
                            </div>
                        </div>
                        <div className="flex items-center gap-4">

                        </div>
                    </div>
                    <div className="rounded-2xl border-2 border-black p-3 ">
                        <h2 className="text-sm font-bold text-blue-950 text-xl mb-4">Manager de l'équipe</h2>
                    </div>
                </div>
            </div>


        </div>
    )
}