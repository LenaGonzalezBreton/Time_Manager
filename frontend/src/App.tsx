import './App.css'
import AppRouter from './AppRouter'

// Composant principal de l'application - il englobe tout
function App() {
  return (
    <div className="app-container">
      {/*
        Ajouter ici des composants globaux comme :
        - <NavBar /> en haut
        - <Footer /> en bas
        - <AuthProvider> pour le contexte d'authentification
      */}

      {/* Système de routing - gère toutes les routes de l'application */}
      <AppRouter />
    </div>
  )
}

export default App