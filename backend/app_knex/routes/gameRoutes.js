const express = require('express');
const router = express.Router();
const gameModel = require('../models/gameModel');
const multer = require('multer');
const path = require('path');

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Assure-toi que ce dossier existe
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });


// GET tous les jeux avec catégories
router.get('/games', async (req, res) => {
  try {
    const games = await gameModel.getGamesWithCategories();
    res.json(games);
  } catch (err) {
    console.error('Erreur dans /games :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un jeu par ID
router.get('/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const game = await gameModel.getGameById(id);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nouveau jeu avec image
router.post('/games', upload.single('image'), async (req, res) => {
  const { id, name, category_id } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    await gameModel.createGame(id, name, category_id, image);
    res.status(201).json({ message: 'Jeu créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mise à jour jeu avec image
router.put('/games/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, category_id } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    await gameModel.updateGame(id, name, category_id, image);
    res.json({ message: 'Jeu mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE un jeu
router.delete('/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await gameModel.deleteGame(id);
    res.json({ message: 'Jeu supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
