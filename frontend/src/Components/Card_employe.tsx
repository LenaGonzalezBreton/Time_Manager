import type { User } from '../services/authService';

interface CardEmployeProps {
    employe: User;
}

const Card_employe = ({ employe }: CardEmployeProps) => {
    if (!employe) return null;

    const prenom = employe.prenom || "";
    const nom = employe.nom || "";
    const email = employe.email || "";
    const telephone = employe.telephone || "";
    const initiales = `${prenom.charAt(0) || "?"}${nom.charAt(0) || "?"}`;

    const roleLabel =
        typeof employe.role === 'object' && employe.role !== null
            ? (employe.role as any).titre
            : employe.role || "Rôle inconnu";

    return (
        <div className="modern-card p-1 group">
            <div className="flex items-center w-full justify-between p-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                        {initiales}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{prenom} {nom}</p>
                        <p className="text-xs text-gray-600">{email}</p>
                        {telephone && <p className="text-xs text-gray-500 mt-0.5">{telephone}</p>}
                    </div>
                </div>
                <div className="text-blue-600 text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {roleLabel}
                </div>
            </div>
        </div>
    )
}

export default Card_employe;
