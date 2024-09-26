// Importer les dépendances
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement à partir de .env
dotenv.config();

// Initialiser l'application Express
const app = express();

// Middleware pour gérer le JSON et les CORS
app.use(cors());
app.use(express.json());

// Route pour récupérer les horaires de lever/coucher du soleil
app.get('/api/sun-times', async (req, res) => {
    const { lat, lng } = req.query; // Récupère les coordonnées depuis la requête
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude et longitude manquantes' });
    }
  
    try {
      // Requête vers l'API Sunrise-Sunset avec les coordonnées de l'utilisateur
      const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`);
      const data = await response.json();
      const sunTimes = data.results;
  
      // Retourner les horaires de lever/coucher du soleil
      res.json({
        sunrise: sunTimes.sunrise,
        sunset: sunTimes.sunset,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des horaires solaires' });
    }
  });
  
  // Lancer le serveur sur le port 5000
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
  });
