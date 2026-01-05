{/*import App from '../App.tsx'
import Login from '../Components/Login.tsx'
import TimerCardPause from '../Components/TimerCardPause.tsx'
import TimerCardInProgress from '../Components/TimerCardInProgress.tsx'
import SignIn from '../Components/SignIn.tsx'*/}
import NavBar from "../Components/NavBar.tsx"
import Collab from '../Components/Collab.tsx'
import Teams from '../Components/Teams.tsx'
import Stats from '../Components/Stats.tsx'
import TimerCardDebut from '../Components/TimerCardDebut.tsx'
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Dashboard_employe(){
    const [open, setOpen] = useState(false);
    return(
        <div className="flex flex-row h-screen  relative bg-gray-200">
            <div className="flex relative">
                {/* Bouton menu (mobile seulement) */}
                <button
                    onClick={() => setOpen(!open)}
                    className="absolute top-4 left-4 z-50 md:hidden"
                >
                    {open ? <X size={20} /> : <Menu size={20}/>}
                </button>

                {/* Barre latérale (NavBar existante) */}
                <div className={`fixed md:static bg-gray-800 text-white h-full w-1/3 md:w-1/5 transition-transform duration-300 z-40 
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                    <NavBar />
                </div>

            <div className="flex flex-col ml-2 justify-between mt-10 p-4">
                <label className="text-3xl font-bold text-blue-950 ">Bonjour Tom Scheffmann !</label>

                    <div className="flex flex-row justify-between rounded-xl">
                        <TimerCardDebut/>
                        <Stats/>


                    </div>
                <div className="flex flex-col gap-5 mb-5 rounded-xl mr-5 items-center">
                    <Collab/>
                    <Teams/>
                </div>
            </div>
            </div>
        </div>
    )
}