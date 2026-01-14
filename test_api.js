// Script de test pour vérifier l'état de l'API
// À exécuter dans la console du navigateur (F12)

console.log("=== TEST API HORAIRES ===");
console.log("Date actuelle:", new Date().toISOString().split('T')[0]);

// Récupérer le token
const token = localStorage.getItem('token');
console.log("Token présent:", !!token);

if (!token) {
    console.error("❌ Pas de token - vous devez être connecté");
} else {
    // Test 1: Récupérer l'horaire d'aujourd'hui
    fetch('http://localhost:5000/api/horaires/today', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => {
            console.log("✅ Horaire d'aujourd'hui:", data);
            if (data && data.jour) {
                console.log("  - Date:", data.jour);
                console.log("  - Débuté:", !!data.heure_arrivee);
                console.log("  - Terminé:", !!data.heure_depart);
            }
        })
        .catch(e => console.error("❌ Erreur today:", e));

    // Test 2: Récupérer les journées incomplètes
    fetch('http://localhost:5000/api/horaires/incomplete', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => {
            console.log("✅ Journées incomplètes:", data);
            console.log("  - Nombre:", data.length);
        })
        .catch(e => console.error("❌ Erreur incomplete:", e));

    // Test 3: Essayer de débuter la journée
    console.log("\n💡 Pour débuter la journée, exécutez:");
    console.log(`fetch('http://localhost:5000/api/horaires/start-day', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ${token}' }
}).then(r => r.json()).then(console.log)`);
}
