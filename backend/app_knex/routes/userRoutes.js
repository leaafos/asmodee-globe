const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const multer = require('multer');
const path = require('path');


// Configuration de Multer pour l'upload d'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


// Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un utilisateur par ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouvel utilisateur avec image
router.post('/users', upload.single('image'), async (req, res) => {
  const { name, surname, jobTitle, structure_id, team_id, score_id, liked_id, role } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await userModel.createUser(name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role);
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un utilisateur existant avec image
router.put('/users/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, surname, jobTitle, structure_id, team_id, score_id, liked_id, role } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await userModel.updateUser(id, name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role);
    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await userModel.deleteUser(id);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connexion simple (démo) par prénom
router.post('/login', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Le prénom est requis.' });
  }

  try {
    const user = await userModel.getUserByName(name);

    if (!user || user.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(404).json({ error: 'Utilisateur non trouvé ou prénom incorrect.' });
    }

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name,
        structure_id: user.structure_id,
        surname: user.surname,
        jobTitle: user.jobTitle,
        image: user.image,
        team_id: user.team_id,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur dans /login:', error); 
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
