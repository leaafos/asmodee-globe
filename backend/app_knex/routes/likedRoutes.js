// likedRoutes.js
const express = require('express');
const router = express.Router();
const likedModel = require('../models/likedModel');

// Récupérer les jeux likés d'un utilisateur
router.get('/liked/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const likedGames = await likedModel.getLikedByUser(userId);
    res.json(likedGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter un jeu aux favoris
router.post('/liked', async (req, res) => {
  const { user_id, game_id, game_image } = req.body;
  if (!user_id || !game_id) {
    return res.status(400).json({ error: 'user_id et game_id requis' });
  }

  try {
    await likedModel.addLiked(user_id, game_id, game_image);
    const updated = await likedModel.getLikedByUser(user_id);
    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un jeu des favoris
router.delete('/liked', async (req, res) => {
  const { user_id, game_id, game_image } = req.body;
  if (!user_id || !game_id) {
    return res.status(400).json({ error: 'user_id et game_id requis' });
  }

  try {
    await likedModel.removeLiked(user_id, game_id, game_image);
    const updated = await likedModel.getLikedByUser(user_id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
