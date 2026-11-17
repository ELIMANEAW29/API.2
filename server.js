require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 5000;

// Permet à Express de lire les corps de requête envoyés au format JSON.
app.use(express.json());

// Retourne la liste complète des utilisateurs enregistrés.
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
});

// Crée un utilisateur à partir des données JSON reçues.
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
    }
    return res.status(400).json({ message: error.message });
  }
});

// Modifie les champs fournis pour l'utilisateur correspondant à cet identifiant.
app.put('/api/users/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Identifiant utilisateur invalide.' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
    }
    return res.status(400).json({ message: error.message });
  }
});

// Supprime l'utilisateur correspondant à l'identifiant reçu dans l'URL.
app.delete('/api/users/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Identifiant utilisateur invalide.' });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    return res.status(200).json({ message: 'Utilisateur supprimé.', user });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression de l utilisateur.' });
  }
});

// Démarre le serveur uniquement après la connexion à la base de données.
async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}.`);
  });
}

startServer();