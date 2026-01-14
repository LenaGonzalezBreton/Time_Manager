import { Mail, Phone, UserCircle } from 'lucide-react';
import type { User } from '../services/authService';

interface CardEmployeProps {
    employe: User;
}

export default function Card_employe({ employe }: CardEmployeProps) {
    if (!employe) return null;

    return (
        <div className="modern-card p-4 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Avatar et nom */}
            <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#AAC7FF] text-[#12171C] flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                    {employe.prenom[0]}{employe.nom[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base truncate">
                        {employe.prenom} {employe.nom}
                    </h3>
                </div>
            </div>

            {/* Informations de contact */}
            <div className="space-y-2 text-sm text-slate-600 mb-3 flex-1">
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate">{employe.email}</span>
                </div>
                {employe.telephone && (
                    <div className="flex items-center gap-2">
                        <Phone size={16} className="text-green-600 flex-shrink-0" />
                        <span>{employe.telephone}</span>
                    </div>
                )}
            </div>

            {/* Badge de rôle en bas */}
            {employe.role && (
                <div className="pt-3 border-t border-slate-200">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-sm">
                        <UserCircle size={14} />
                        {typeof employe.role === 'object' ? (employe.role as any).titre : employe.role}
                    </span>
                </div>
            )}
        </div>
    );
}
