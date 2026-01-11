import { useAuth } from "../contexts/AuthContext";
import NavBar from "../Components/NavBar.tsx"

import Stats from '../Components/Stats.tsx'
import TimerCardDebut from '../Components/TimerCardDebut.tsx'
import Retards from '../Components/Retards.tsx'
import Absences from '../Components/Absences.tsx'


import { Menu, X } from "lucide-react";
import { useState } from "react";
import MonEquipe from "../Components/MonEquipe.tsx";

export default function Dashboard_employé() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    return (
        <div className="flex h-screen w-screen relative" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            {/* Bouton menu (mobile seulement) */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute top-4 left-4 z-50 md:hidden text-gray-700"
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
            <div className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white transition-transform duration-300 z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:w-3/10`}>
                <NavBar />
            </div>

            {/* CONTENU PRINCIPAL */}
            <main className="flex flex-col p-8 gap-8 h-screen w-full overflow-y-auto justify-between">
                <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4">
                    <span className="text-5xl">👋</span>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Bonjour {user?.prenom} !
                        </h1>
                        <p className="text-blue-100 mt-1">Bienvenue sur votre tableau de bord</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:justify-center gap-10 rounded-xl">
                    <TimerCardDebut />
                    <Stats />
                </div>

                <div className="flex flex-col items-center md:flex-row md:gap-20 gap-6 rounded-xl justify-center">
                    <Retards />
                    <Absences />
                    <MonEquipe />
                </div>
            </main>
        </div >
    )
}
