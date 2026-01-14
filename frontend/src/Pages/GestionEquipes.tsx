import { usePageTitle } from '../hooks/usePageTitle';
import { useState, useEffect } from 'react';
import NavBar from "../Components/NavBar";
import { Menu, X, Users, Shield, Plus, Trash2, UserPlus, AlertCircle, UserMinus, Search } from "lucide-react";
import equipeService, { type Equipe } from '../services/equipe.service';
import utilisateursService from '../services/utilisateurs.service';
import Card_employe from '../Components/Card_employe';
import { useAuth } from '../contexts/AuthContext';

const ITEMS_PER_PAGE = 5;

export default function GestionEquipes() {
    const { isManager } = useAuth();
    const [open, setOpen] = useState(false);
    usePageTitle('Gestion des équipes');
    const [equipes, setEquipes] = useState<Equipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    // États pour Modales et Formulaires
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Equipe | null>(null);

    // Données curseurs
    const [allUsers, setAllUsers] = useState<any[]>([]); // Utilisé pour le dropdown d'ajout
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    // Form creation équipe
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamDesc, setNewTeamDesc] = useState("");

    const fetchEquipes = async () => {
        try {
            setLoading(true);
            // Pour la page de GESTION, on charge TOUTES les équipes
            const data = await equipeService.getAll();
            setEquipes(data);
            setError(null);
        } catch (err: any) {
            console.error('Erreur lors du chargement des équipes:', err);
            setError(err.response?.data?.message || 'Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEquipes();
    }, []);

    // Filtrage des équipes
    const filteredEquipes = equipes.filter(team =>
        (team.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // Reset pagination quand on cherche
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Charger la liste des utilisateurs quand on ouvre la modale d'ajout
    useEffect(() => {
        if (showAddMemberModal) {
            const loadUsers = async () => {
                try {
                    const users = await utilisateursService.getAll();
                    setAllUsers(users);
                } catch (e) {
                    console.error("Erreur chargement users:", e);
                }
            };
            loadUsers();
        }
    }, [showAddMemberModal]);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await equipeService.create({ nom: newTeamName, description: newTeamDesc });
            setShowCreateModal(false);
            setNewTeamName("");
            setNewTeamDesc("");
            // Refresh
            fetchEquipes();
        } catch (error) {
            alert("Erreur lors de la création de l'équipe");
        }
    };

    const handleDeleteTeam = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe ?")) {
            try {
                await equipeService.delete(id);
                fetchEquipes();
            } catch (error) {
                alert("Impossible de supprimer l'équipe (peut-être contient-elle encore des membres ?)");
            }
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam || !selectedUserId) return;
        try {
            await equipeService.addMember(selectedTeam.id_equipe, Number(selectedUserId));
            setShowAddMemberModal(false);
            setSelectedUserId("");
            fetchEquipes();
        } catch (error) {
            alert("Erreur lors de l'ajout du membre");
        }
    };

    const startAddMember = (team: Equipe) => {
        setSelectedTeam(team);
        setShowAddMemberModal(true);
    };

    const handleRemoveMember = async (team: Equipe, userId: number) => {
        const member = team.membres?.find(m => m.id_utilisateur === userId);
        if (!member) return;

        const roleName = typeof member.role === 'string'
            ? member.role
            : (member.role as any)?.titre || (member.role as any)?.nom || '';

        const isManager = roleName.toLowerCase() === 'manager';

        if (isManager) {
            if (!window.confirm(`ATTENTION : ${member.prenom} ${member.nom} est un Manager.\n\nLe supprimer entraînera la SUPPRESSION DÉFINITIVE de l'équipe "${team.nom}".\n\nVoulez-vous vraiment continuer ?`)) {
                return;
            }
            try {
                await equipeService.delete(team.id_equipe);
                fetchEquipes(); // Recharger la liste (l'équipe disparaîtra)
            } catch (error) {
                alert(error instanceof Error ? error.message : "Erreur lors de la suppression de l'équipe");
            }
        } else {
            if (!window.confirm("Êtes-vous sûr de vouloir retirer ce membre de l'équipe ?")) return;
            try {
                await equipeService.removeMember(team.id_equipe, userId);
                fetchEquipes();
            } catch (error) {
                alert(error instanceof Error ? error.message : "Erreur lors du retrait du membre");
            }
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

            {/* Overlay sombre */}
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-shrink-0">
                    <div className="gradient-header p-6 rounded-2xl shadow-blue flex items-center gap-4 flex-1 w-full md:w-auto">
                        <span className="text-5xl">🛠️</span>
                        <div>
                            <h1 className="text-4xl font-bold text-[#12171C] tracking-tight">
                                Gestion des Équipes
                            </h1>
                            <p className="text-[#12171C] opacity-75 mt-1">Gérez l'ensemble des équipes et leurs membres</p>
                        </div>
                    </div>

                    {/* Bouton Créer équipe (Toujours visible ici car c'est une page admin/manager) */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 font-bold text-lg whitespace-nowrap"
                    >
                        <Plus size={24} />
                        Créer une équipe
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Barre de recherche */}
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={20} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher une équipe..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <p className="text-slate-600 font-medium">
                        <span className="text-2xl font-bold text-blue-600">{filteredEquipes.length}</span> équipe{filteredEquipes.length > 1 ? 's' : ''}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600 animate-pulse text-lg">Chargement des équipes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {filteredEquipes && filteredEquipes.length > 0 ? (
                            <>
                                {filteredEquipes
                                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                                    .map((team, index) => (
                                        <div key={team?.id_equipe || index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                            {/* En-tête de la Card Équipe */}
                                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                                            {team?.nom || "Équipe sans nom"}
                                                        </h3>
                                                        <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-slate-500 border border-slate-200 flex items-center gap-1">
                                                            <Users size={14} />
                                                            {team.membres?.length || 0}
                                                        </span>
                                                    </div>
                                                    {team.description && (
                                                        <p className="text-slate-500 mt-1 text-sm">{team.description}</p>
                                                    )}
                                                </div>

                                                {/* Bouton Supprimer l'équipe */}
                                                <button
                                                    onClick={() => handleDeleteTeam(team.id_equipe)}
                                                    className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors font-medium text-sm"
                                                    title="Supprimer cette équipe"
                                                >
                                                    <Trash2 size={18} />
                                                    Supprimer l'équipe
                                                </button>
                                            </div>

                                            {/* Contenu : Grille des membres */}
                                            <div className="p-6 bg-white">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                    {/* Liste des membres existants */}
                                                    {team?.membres && team.membres.map((member) => (
                                                        <div key={member.id_utilisateur} className="h-full relative group">
                                                            <Card_employe employe={member} />
                                                            <button
                                                                onClick={() => handleRemoveMember(team, member.id_utilisateur)}
                                                                className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                                title="Retirer de l'équipe"
                                                            >
                                                                <UserMinus size={16} />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Card "Ajouter un membre" - Placé à la fin */}
                                                    <div
                                                        onClick={() => startAddMember(team)}
                                                        className="min-h-[180px] h-full modern-card p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-center items-center bg-slate-50 border-2 border-dashed border-slate-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 group rounded-xl"
                                                    >
                                                        <div className="w-14 h-14 rounded-full bg-slate-200 group-hover:bg-blue-200 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition-colors mb-3">
                                                            <UserPlus size={28} />
                                                        </div>
                                                        <span className="font-semibold text-slate-500 group-hover:text-blue-600">Ajouter un membre</span>
                                                    </div>
                                                </div>

                                                {!team.membres?.length && (
                                                    <div className="text-center py-10 text-slate-400">
                                                        Aucun membre dans cette équipe.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                {/* Pagination Controls */}
                                {filteredEquipes.length > ITEMS_PER_PAGE && (
                                    <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"
                                        >
                                            Précédent
                                        </button>
                                        <span className="text-slate-600 font-medium">
                                            Page {currentPage} sur {Math.ceil(filteredEquipes.length / ITEMS_PER_PAGE)}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEquipes.length / ITEMS_PER_PAGE)))}
                                            disabled={currentPage === Math.ceil(filteredEquipes.length / ITEMS_PER_PAGE)}
                                            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
                                <Users size={64} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold text-gray-700">Aucune équipe trouvée</h3>
                                <p className="mt-2 text-gray-500">Commencez par créer une équipe !</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* MODALE CRÉATION ÉQUIPE */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-800">Nouvelle Équipe</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'équipe</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Ex: Marketing, Développeurs..."
                                    value={newTeamName}
                                    onChange={e => setNewTeamName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description (optionnel)</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    rows={3}
                                    placeholder="Courte description de l'équipe..."
                                    value={newTeamDesc}
                                    onChange={e => setNewTeamDesc(e.target.value)}
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
                                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200"
                                >
                                    Créer l'équipe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODALE AJOUT MEMBRE */}
            {showAddMemberModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Ajouter un membre</h3>
                            <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start gap-3 text-sm text-blue-700">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <p>Vous ajoutez un membre à l'équipe <strong>{selectedTeam?.nom}</strong>.</p>
                        </div>

                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sélectionner un utilisateur</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                    value={selectedUserId}
                                    onChange={e => setSelectedUserId(e.target.value)}
                                >
                                    <option value="">-- Choisir un utilisateur --</option>
                                    {allUsers
                                        .filter(u => !selectedTeam?.membres?.some(m => m.id_utilisateur === u.id_utilisateur)) // Exclure ceux déjà dans l'équipe
                                        .filter(u => {
                                            // Exclure les managers
                                            const roleName = typeof u.role === 'string' ? u.role : (u.role as any)?.titre || (u.role as any)?.nom;
                                            return roleName?.toLowerCase() !== 'manager';
                                        })
                                        .map(user => (
                                            <option key={user.id_utilisateur} value={user.id_utilisateur}>
                                                {user.prenom} {user.nom} ({user.email})
                                            </option>
                                        ))}
                                </select>
                                {allUsers.length === 0 && <p className="text-xs text-slate-400 mt-1">Chargement des utilisateurs...</p>}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddMemberModal(false)}
                                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedUserId}
                                    className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
