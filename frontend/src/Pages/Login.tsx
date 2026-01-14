import { usePageTitle } from '../hooks/usePageTitle';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from "../Images/Logo_mieux.png";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            // Rediriger vers le dashboard après connexion réussie
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Erreur de connexion:', err);
            setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen justify-center flex flex-col text-blue-950 bg-gray-300">
            <div className="flex items-center justify-center">
                <img
                    src={logo}
                    alt="Logo Tima"
                    className="filter brightness-50 saturate-[180%] hue-rotate-[10deg]"
                />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 justify-between items-center">
                <div className="flex flex-col gap-3 justify-between h-1/10">
                    <h2 className="text-3xl font-semibold">Connexion</h2>
                    <h3 className="text-2xl font-bold">Bienvenue chez Tima</h3>
                </div>

                <div className="md:w-1/4 w-11/12 justify-center flex flex-col bg-blue-300 rounded-2xl gap-2 p-3 border-2 border-blue-950">
                    {error && (
                        <div className="bg-red-500 text-white p-3 rounded-lg mb-2 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col justify-between gap-4">
                        <label htmlFor="email" className="font-bold text-xl">Adresse mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-blue-950 text-white p-1 pl-3 rounded-3xl placeholder-white mr-1 ml-1 p-2"
                            placeholder="exemple@domaine.com"
                            required
                            disabled={loading}
                        />

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-blue-950 text-white p-1 pl-3 rounded-3xl placeholder-white mr-1 ml-1 p-2"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />

                        <div className="flex justify-between items-center text-sm text-gray-800 ml-1 mr-1">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="accent-blue-600"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={loading}
                                />
                                Se souvenir de moi
                            </label>
                            <a href="#" className="!text-blue-850 hover:underline">
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mr-25 ml-25 text-white !bg-[#12171C] hover:!bg-[#12171C] active:scale-95 transition transform duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <label className="text-sm text-center">
                        Problème de connexion ? Contactez votre manager
                    </label>
                </div>
            </form>
        </div>
    );
}
