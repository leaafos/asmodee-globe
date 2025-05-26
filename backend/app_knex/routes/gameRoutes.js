// gameRoutes.js
const express = require('express');
const router = express.Router();
const gameModel = require('../models/gameModel');

// Récupérer tous les games
router.get('/games', async (req, res) => {
  try {
    const games = await gameModel.getAllGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une game par ID
router.get('/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const game = await gameModel.getGameById(id);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau jeu
router.post('/games', async (req, res) => {
  const { id, name, category_id, liked_id, score_id } = req.body;
  try {
    await gameModel.createGame(id, name, category_id, liked_id, score_id);
    res.status(201).json({ message: 'Jeu créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un jeu existant
router.put('/games/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category_id, liked_id, score_id } = req.body;
  try {
    await gameModel.updateGame(id, name, category_id, liked_id, score_id);
    res.json({ message: 'Jeu mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un jeu
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
