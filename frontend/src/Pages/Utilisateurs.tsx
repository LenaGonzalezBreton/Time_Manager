import { useState, useEffect } from 'react';
import NavBar from "../Components/NavBar";
import { Menu, X, Users, Mail, Phone, Shield, Edit2, Save, ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import utilisateursService from '../services/utilisateurs.service';
import type { Utilisateur } from '../types/utilisateur.types';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api.service';

const getRoles = () => apiService.get<any[]>('/roles');

const ITEMS_PER_PAGE = 9;

export default function UtilisateursPage() {
    const { user, isAdmin, isManager } = useAuth();

    const [open, setOpen] = useState(false);
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    // États pour le modal d'édition
    const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
    const [editForm, setEditForm] = useState({ nom: '', prenom: '', email: '', telephone: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // États pour le modal de création
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', id_role: 0 });
    const [createLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersData, rolesData] = await Promise.all([
                    utilisateursService.getAll(),
                    isAdmin ? getRoles() : Promise.resolve([])
                ]);
                setUtilisateurs(usersData);
                if (isAdmin) setRoles(rolesData);
                setError(null);
            } catch (err: any) {
                console.error('Erreur lors du chargement:', err);
                setError(err.response?.data?.message || 'Erreur de connexion au serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAdmin]);

    // Filtrage
    const filteredUtilisateurs = utilisateurs.filter(user =>
        (user.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.prenom?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // Reset pagination quand on cherche
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleEditClick = (user: Utilisateur) => {
        setEditingUser(user);
        setEditForm({
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone || ''
        });
        setEditError(null);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setEditLoading(true);
        setEditError(null);

        try {
            const updated = await utilisateursService.updateByManager(editingUser.id_utilisateur, {
                nom: editForm.nom,
                prenom: editForm.prenom,
                email: editForm.email,
                telephone: editForm.telephone || null
            });

            // Mettre à jour la liste
            setUtilisateurs(utilisateurs.map(u =>
                u.id_utilisateur === updated.id_utilisateur ? updated : u
            ));

            setEditingUser(null);
        } catch (err: any) {
            setEditError(err.response?.data?.message || 'Erreur lors de la modification');
        } finally {
            setEditLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            const payload: any = {
                nom: newUserForm.nom,
                prenom: newUserForm.prenom,
                email: newUserForm.email,
                telephone: newUserForm.telephone || undefined,
                mot_de_passe: newUserForm.password
            };

            if (isAdmin && newUserForm.id_role) {
                payload.id_role = newUserForm.id_role;
            }

            const created = await utilisateursService.create(payload);

            setUtilisateurs([...utilisateurs, created]);
            setShowCreateModal(false);
            setNewUserForm({ nom: '', prenom: '', email: '', telephone: '', password: '', id_role: 0 });
        } catch (err: any) {
            alert(err.response?.data?.message || "Erreur lors de la création de l'utilisateur");
        } finally {
            setCreateLoading(false);
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
            <div className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white transition-transform duration-300 z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0 md:w-3/10`}>
                <NavBar />
            </div>

            {/* CONTENU PRINCIPAL */}
            <main className="flex flex-col p-8 gap-8 h-screen w-full overflow-y-auto">
                {/* Header avec gradient */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-shrink-0">
                    <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4 flex-1 w-full md:w-auto">
                        <span className="text-5xl"><Users size={48} /></span>
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight">
                                Utilisateurs
                            </h1>
                            <p className="text-blue-100 mt-1">Gérez les membres de l'organisation</p>
                        </div>
                    </div>

                    {/* Bouton Créer utilisateur */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 font-bold text-lg whitespace-nowrap"
                    >
                        <Plus size={24} />
                        Créer un utilisateur
                    </button>
                </div>

                {/* Contenu */}
                {loading ? (
                    <div className="modern-card p-8 text-center">
                        <div className="animate-pulse text-blue-600 text-lg">⏳ Chargement des utilisateurs...</div>
                    </div>
                ) : error ? (
                    <div className="modern-card p-6 border-l-4 border-red-500 bg-red-50">
                        <p className="text-red-700 font-semibold">❌ Erreur: {error}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Barre de recherche */}
                            <div className="relative w-full md:w-96">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou prénom..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <p className="text-slate-600 font-medium">
                                <span className="text-2xl font-bold text-blue-600">{filteredUtilisateurs.length}</span> utilisateur{filteredUtilisateurs.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUtilisateurs
                                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                                .map((user) => (
                                    <div
                                        key={user.id_utilisateur}
                                        className="modern-card p-6 hover:shadow-blue transition-all duration-300"
                                    >
                                        {/* Avatar avec initiales */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                                                {user.prenom?.charAt(0) || '?'}{user.nom?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-slate-900">
                                                    {user.prenom} {user.nom}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Shield size={14} className="text-blue-500" />
                                                    <span className="text-sm text-blue-600 font-medium">
                                                        {(user.role as any)?.titre || user.role?.nom || 'Employé'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Informations de contact */}
                                        <div className="space-y-2 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail size={16} className="text-blue-500" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            {user.telephone && (
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Phone size={16} className="text-blue-500" />
                                                    <span>{user.telephone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bouton Modifier (seulement si pas manager) */}
                                        {(user.role as any)?.titre !== 'Manager' && (
                                            <div className="mt-4 pt-4 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                                                >
                                                    <Edit2 size={16} />
                                                    Modifier
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>

                        {/* Pagination Controls */}
                        {filteredUtilisateurs.length > ITEMS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"
                                >
                                    Précédent
                                </button>
                                <span className="text-slate-600 font-medium">
                                    Page {currentPage} sur {Math.ceil(filteredUtilisateurs.length / ITEMS_PER_PAGE)}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUtilisateurs.length / ITEMS_PER_PAGE)))}
                                    disabled={currentPage === Math.ceil(filteredUtilisateurs.length / ITEMS_PER_PAGE)}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modal d'édition */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="modern-card p-6 max-w-md w-full animate-fadeIn">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Modifier {editingUser.prenom} {editingUser.nom}
                        </h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                                <input
                                    type="text"
                                    value={editForm.nom}
                                    onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                                <input
                                    type="text"
                                    value={editForm.prenom}
                                    onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                                <input
                                    type="tel"
                                    value={editForm.telephone}
                                    onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {editError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {editError}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                                    disabled={editLoading}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                                    disabled={editLoading}
                                >
                                    <Save size={16} />
                                    {editLoading ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de création */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Ajouter un utilisateur</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={newUserForm.nom}
                                        onChange={e => setNewUserForm({ ...newUserForm, nom: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        value={newUserForm.prenom}
                                        onChange={e => setNewUserForm({ ...newUserForm, prenom: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={newUserForm.email}
                                    onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={newUserForm.telephone}
                                    onChange={e => setNewUserForm({ ...newUserForm, telephone: e.target.value })}
                                />
                            </div>

                            {/* SELECTOR FOR ROLE - ADMIN ONLY */}
                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                        value={newUserForm.id_role}
                                        onChange={e => setNewUserForm({ ...newUserForm, id_role: Number(e.target.value) })}
                                        required
                                    >
                                        <option value={0}>Sélectionner un rôle</option>
                                        {roles.map(role => (
                                            <option key={role.id_role} value={role.id_role}>{role.titre}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe provisoire</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={newUserForm.password}
                                    onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    {createLoading ? 'Création...' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
