import { usePageTitle } from '../hooks/usePageTitle';
import { useState } from 'react';
import NavBar from "../Components/NavBar";
import { Menu, X, User, Lock, Save } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import utilisateursService from '../services/utilisateurs.service';

export default function Parametres() {
    const [open, setOpen] = useState(false);
    usePageTitle('Paramètres');
    const { user, updateUser } = useAuth();

    // États pour les informations personnelles
    const [email, setEmail] = useState(user?.email || '');
    const [telephone, setTelephone] = useState(user?.telephone || '');
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [successInfo, setSuccessInfo] = useState('');
    const [errorInfo, setErrorInfo] = useState('');

    // États pour le changement de mot de passe
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [successPassword, setSuccessPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingInfo(true);
        setSuccessInfo('');
        setErrorInfo('');

        try {
            const updated = await utilisateursService.updateSelf({ email, telephone: telephone || null });
            // Mettre à jour le contexte avec les nouvelles données
            updateUser({ email: updated.email, telephone: updated.telephone });
            setSuccessInfo('Informations mises à jour avec succès');
        } catch (err: any) {
            setErrorInfo(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoadingInfo(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPassword(true);
        setSuccessPassword('');
        setErrorPassword('');

        if (newPassword !== confirmPassword) {
            setErrorPassword('Les mots de passe ne correspondent pas');
            setLoadingPassword(false);
            return;
        }

        if (newPassword.length < 6) {
            setErrorPassword('Le mot de passe doit contenir au moins 6 caractères');
            setLoadingPassword(false);
            return;
        }

        try {
            await utilisateursService.updatePassword(oldPassword, newPassword);
            setSuccessPassword('Mot de passe modifié avec succès');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setErrorPassword(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
        } finally {
            setLoadingPassword(false);
        }
    };

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
            <div className={`fixed top-0 left-0 h-full w-64 bg-white text-[#12171C] transition-transform duration-300 z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:w-3/10`}>
                <NavBar />
            </div>

            {/* CONTENU PRINCIPAL */}
            <main className="flex flex-col p-8 gap-8 h-screen w-full overflow-y-auto">
                {/* Header */}
                <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4">
                    <span className="text-5xl">⚙️</span>
                    <div>
                        <h1 className="text-4xl font-bold text-[#12171C] tracking-tight">
                            Paramètres
                        </h1>
                        <p className="text-[#12171C] opacity-75 mt-1">Gérez vos informations personnelles</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Section Informations personnelles */}
                    <div className="modern-card p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <User className="text-blue-600" size={24} />
                            <h2 className="text-2xl font-bold text-slate-900">Informations personnelles</h2>
                        </div>

                        <form onSubmit={handleUpdateInfo} className="space-y-4">
                            {/* Nom et Prénom (lecture seule) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                                    <input
                                        type="text"
                                        value={user?.prenom || ''}
                                        disabled
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        value={user?.nom || ''}
                                        disabled
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                                <input
                                    type="tel"
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Messages */}
                            {successInfo && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    {successInfo}
                                </div>
                            )}
                            {errorInfo && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {errorInfo}
                                </div>
                            )}

                            {/* Bouton */}
                            <button
                                type="submit"
                                disabled={loadingInfo}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={20} />
                                {loadingInfo ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </form>
                    </div>

                    {/* Section Sécurité */}
                    <div className="modern-card p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                            <Lock className="text-blue-600" size={24} />
                            <h2 className="text-2xl font-bold text-slate-900">Sécurité</h2>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            {/* Ancien mot de passe */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ancien mot de passe</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Nouveau mot de passe */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Confirmer mot de passe */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirmer le nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Messages */}
                            {successPassword && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    {successPassword}
                                </div>
                            )}
                            {errorPassword && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {errorPassword}
                                </div>
                            )}

                            {/* Bouton */}
                            <button
                                type="submit"
                                disabled={loadingPassword}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Lock size={20} />
                                {loadingPassword ? 'Modification...' : 'Changer le mot de passe'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
