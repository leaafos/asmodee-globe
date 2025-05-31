// reactionRoutes.js
const express = require('express');
const router = express.Router();
const reactionModel = require('../models/reactionModel');
const knex = require('knex')(require('../knexfile')['development']);

// Récupérer tous les reactions
router.get('/reactions', async (req, res) => {
  try {
    const reactions = await reactionModel.getAllReactions();
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les reactions d'un utilisateur pour un message spécifique
router.post('/reactions/toggle', async (req, res) => {
  const { user_id, reaction, messagePT_id } = req.body;

  if (!user_id || !reaction || !messagePT_id) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const existing = await knex('reactions')
      .where({ user_id, reaction, messagePT_id })
      .first();

    if (existing) {
      await knex('reactions').where({ id: existing.id }).del();
      return res.json({ message: 'Réaction supprimée' });
    } else {
      await knex('reactions').insert({ user_id, reaction, messagePT_id });
      return res.json({ message: 'Réaction ajoutée' });
    }
  } catch (error) {
    console.error('Erreur toggle réaction:', error);
    res.status(500).json({ error: 'Erreur serveur lors du toggle réaction' });
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
  const { user_id, reaction, messagePT_id } = req.body;
  try {
    await reactionModel.createReaction(user_id, reaction, messagePT_id);
    res.status(201).json({ message: 'Reaction créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une reaction existante
router.put('/reactions/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, reaction, messagePT_id } = req.body;
  try {
    await reactionModel.updateReaction(id, user_id, reaction, messagePT_id);
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
