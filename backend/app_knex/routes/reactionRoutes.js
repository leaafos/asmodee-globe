// reactionRoutes.js
const express = require('express');
const router = express.Router();
const reactionModel = require('../models/reactionModel');

// Récupérer tous les reactions
router.get('/reactions', async (req, res) => {
  try {
    const reactions = await reactionModel.getAllReactions();
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une reaction par ID
router.get('/reactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const reaction = await reactionModel.getReactionById(id);
    res.json(reaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer une nouvelle reaction
router.post('/reactions', async (req, res) => {
  const { content } = req.body;
  try {
    await reactionModel.createReaction(content);
    res.status(201).json({ message: 'Reaction créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une reaction existante
router.put('/reactions/:id', async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body;
  try {
    await reactionModel.updateReaction(id, reaction);
    res.json({ message: 'Reaction mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une reaction
router.delete('/reactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await reactionModel.deleteReaction(id);
    res.json({ message: 'Reaction supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
