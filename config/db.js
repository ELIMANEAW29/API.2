const mongoose = require('mongoose');

// Établit la connexion à la base MongoDB définie dans le fichier .env.
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connexion à MongoDB réussie.');
  } catch (error) {
    console.error('Échec de la connexion à MongoDB :', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;