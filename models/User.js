const mongoose = require('mongoose');

// Définit les informations requises pour créer un utilisateur.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'adresse e-mail est obligatoire."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      min: [0, "L'âge ne peut pas être négatif."],
    },
  },
  { timestamps: true }
);

// Exporte le modèle utilisé par les routes de l'API.
module.exports = mongoose.model('User', userSchema);