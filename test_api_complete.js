// Test direct de l'API - À copier dans la console du navigateur (F12)

console.clear();
console.log("=== TEST API COMPLET ===\n");

const token = localStorage.getItem('token');
const baseURL = 'http://localhost:5000/api';

if (!token) {
    console.error("❌ Pas de token - connectez-vous d'abord");
} else {
    // Test 1: Route /incomplete
    console.log("📡 Test 1: GET /horaires/incomplete");
    fetch(`${baseURL}/horaires/incomplete`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(async r => {
            console.log("  Status:", r.status);
            const text = await r.text();
            console.log("  Response (first 200 chars):", text.substring(0, 200));
            try {
                const json = JSON.parse(text);
                console.log("  ✅ JSON valide:", json);
            } catch (e) {
                console.error("  ❌ Pas du JSON:", e.message);
            }
        });

    // Test 2: Route /today
    console.log("\n📡 Test 2: GET /horaires/today");
    fetch(`${baseURL}/horaires/today`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => {
            console.log("  ✅ Horaire:", data);
            if (data) {
                console.log("    - Date:", data.jour);
                console.log("    - Retard:", data.minutes_retard, "minutes");
            }
        });

    // Test 3: Liste tous les horaires
    console.log("\n📡 Test 3: GET /horaires (tous)");
    fetch(`${baseURL}/horaires`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => {
            const today = data.filter(h => h.jour === new Date().toISOString().split('T')[0]);
            console.log("  ✅ Total horaires:", data.length);
            console.log("  ✅ Horaires aujourd'hui:", today.length);
            if (today.length > 0) {
                console.log("  Retards aujourd'hui:", today.map(h => h.minutes_retard));
            }
        });
}
