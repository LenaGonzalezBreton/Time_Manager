import './App.css'
import AppRouter from './AppRouter'
import { AuthProvider } from './contexts/AuthContext'

// Composant principal de l'application - il englobe tout
function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        {/*
          Ajouter ici des composants globaux comme :
          - <NavBar /> en haut
          - <Footer /> en bas
        */}

        {/* Système de routing - gère toutes les routes de l'application */}
        <AppRouter />
      </div>
    </AuthProvider>
  )
}

export default App