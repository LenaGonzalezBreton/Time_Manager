import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
// @ts-ignore
import logo from "../Images/Logo_mieux.png"
import { House, Handshake, Calendar, ChartColumn, Settings, LogOut, Users, UsersRound, History as HistoryIcon, Type } from "lucide-react";

const NavBar = () => {
    const { isManager, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDyslexicFont, setIsDyslexicFont] = useState(false);

    // Apply font to body element
    useEffect(() => {
        if (isDyslexicFont) {
            document.body.classList.add('font-dyslexic');
        } else {
            document.body.classList.remove('font-dyslexic');
        }
    }, [isDyslexicFont]);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    const linkBase = "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group";
    const linkActive = "bg-[#AAC7FF] text-[#12171C] shadow-lg";
    const linkInactive = "text-[#12171C] hover:bg-[#AAC7FF]";

    return (
        <aside className="h-full flex flex-col justify-between p-6 bg-white shadow-2xl">
            <div>
                <img src={logo} className="w-32 mx-auto mb-10 filter drop-shadow-lg" alt="Logo" />

                <div className="flex flex-col gap-2">
                    {/* MENU MANAGER / ADMIN */}
                    {isManager ? (
                        <>
                            {/* ADMINISTRATION */}
                            <div className="mb-2">
                                <p className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                                    Administration
                                </p>
                                <div className="flex flex-col gap-1">
                                    <Link
                                        to="/utilisateurs"
                                        className={`${linkBase} ${isActive('/utilisateurs') ? linkActive : linkInactive}`}
                                    >
                                        <Users size={20} />
                                        <span>Utilisateurs</span>
                                    </Link>

                                    <Link
                                        to="/gestion-equipes"
                                        className={`${linkBase} ${isActive('/gestion-equipes') ? linkActive : linkInactive}`}
                                    >
                                        <UsersRound size={20} />
                                        <span>Équipes</span>
                                    </Link>

                                    <Link
                                        to="/historique"
                                        className={`${linkBase} ${isActive('/historique') ? linkActive : linkInactive}`}
                                    >
                                        <HistoryIcon size={20} />
                                        <span>Historique</span>
                                    </Link>
                                </div>
                            </div>

                            {/* INFORMATIONS */}
                            <div className="mb-2">
                                <p className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                                    Informations
                                </p>
                                <div className="flex flex-col gap-1">
                                    <Link
                                        to="/dashboard"
                                        className={`${linkBase} ${isActive('/dashboard') ? linkActive : linkInactive}`}
                                    >
                                        <House size={20} />
                                        <span>Dashboard</span>
                                    </Link>

                                    <Link
                                        to="/equipes"
                                        className={`${linkBase} ${isActive('/equipes') ? linkActive : linkInactive}`}
                                    >
                                        <Handshake size={20} />
                                        <span>Mes équipes</span>
                                    </Link>

                                    <Link
                                        to="/calendrier"
                                        className={`${linkBase} ${isActive('/calendrier') ? linkActive : linkInactive}`}
                                    >
                                        <Calendar size={20} />
                                        <span>Calendrier</span>
                                    </Link>

                                    <Link
                                        to="/statistiques"
                                        className={`${linkBase} ${isActive('/statistiques') ? linkActive : linkInactive}`}
                                    >
                                        <ChartColumn size={20} />
                                        <span>Statistiques</span>
                                    </Link>

                                    <Link
                                        to="/parametres"
                                        className={`${linkBase} ${linkInactive}`}
                                    >
                                        <Settings size={20} />
                                        <span>Paramètres</span>
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* MENU EMPLOYÉ (Liste simple) */
                        <>
                            <Link
                                to="/dashboard"
                                className={`${linkBase} ${isActive('/dashboard') ? linkActive : linkInactive}`}
                            >
                                <House size={20} />
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                to="/equipes"
                                className={`${linkBase} ${isActive('/equipes') ? linkActive : linkInactive}`}
                            >
                                <Handshake size={20} />
                                <span>Mon équipe</span>
                            </Link>

                            <Link
                                to="/calendrier"
                                className={`${linkBase} ${isActive('/calendrier') ? linkActive : linkInactive}`}
                            >
                                <Calendar size={20} />
                                <span>Calendrier</span>
                            </Link>

                            <Link
                                to="/statistiques"
                                className={`${linkBase} ${isActive('/statistiques') ? linkActive : linkInactive}`}
                            >
                                <ChartColumn size={20} />
                                <span>Statistiques</span>
                            </Link>

                            <Link
                                to="/parametres"
                                className={`${linkBase} ${linkInactive}`}
                            >
                                <Settings size={20} />
                                <span>Paramètres</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {/* Font Toggle Button */}
                <button
                    onClick={() => setIsDyslexicFont(!isDyslexicFont)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-[#12171C] hover:bg-[#AAC7FF] border border-slate-300"
                >
                    <Type size={20} />
                    <span>{isDyslexicFont ? 'Mode Standard' : 'Mode Dyslexique'}</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-[#12171C] hover:bg-red-600/20 border border-red-600/30 hover:border-red-600"
                >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default NavBar;