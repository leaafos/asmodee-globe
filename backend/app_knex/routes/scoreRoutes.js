const express = require('express');
const router = express.Router();
const scoreModel = require('../models/scoreModel');

// Récupérer tous les scores d'un utilisateur
router.get('/scores/user/:userId/scores', async (req, res) => {
  const { userId } = req.params;
  try {
    const scores = await scoreModel.getScoresByUserId(userId);
    if (!scores || scores.length === 0) {
      return res.status(404).json({ error: 'Aucun score trouvé pour cet utilisateur' });
    }
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer le classement global avec indication de l'utilisateur
router.get('/scores/user/:userId/ranking', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const ranking = await scoreModel.getRanking(userId);
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un score
router.post('/scores', async (req, res) => {
  try {
    const { user_id, game_id, score, date, play_id, ranking } = req.body;
    await scoreModel.addScore({ user_id, game_id, score, date, play_id, ranking });
    res.status(201).json({ message: 'Score ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
