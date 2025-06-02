// routes/sinkOrSail.js

const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile')['development']);
const sinkOrSailModel = require('../models/sinkOrSailModel');

// Récupérer tous les votes Sink or Sail
router.get('/', async (req, res) => {
  try {
    const allVotes = await sinkOrSailModel.getAllSinkOrSails();
    res.json(allVotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des votes Sink or Sail' });
  }
});

// Récupérer les jeux sélectionnés pour Sink or Sail
router.get('/selected', async (req, res) => {
  try {
    const selectedIds = await sinkOrSailModel.getSelectedGameIds();
    const selectedGames = await knex('games').whereIn('id', selectedIds);
    res.json(selectedGames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des jeux sélectionnés' });
  }
});

// Récupérer les jeux qui NE SONT PAS dans Sink or Sail (pour la sidebar par exemple)
router.get('/excluded', async (req, res) => {
  try {
    const selectedIds = await sinkOrSailModel.getSelectedGameIds();
    const availableGames = await knex('games').whereNotIn('id', selectedIds);
    res.json(availableGames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des jeux exclus' });
  }
});

// Enregistrer un vote Sink or Sail
router.post('/vote', async (req, res) => {
  const { game_id, vote, time, season } = req.body;
  if (!game_id || vote === undefined || !season) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    await sinkOrSailModel.createSinkOrSail(game_id, vote, time, season);
    res.status(201).json({ message: 'Vote enregistré avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du vote' });
  }
});

// Voir les votes totaux par jeu avec leurs noms
router.get('/votes/counts', async (req, res) => {
  try {
    const voteCounts = await sinkOrSailModel.getVoteCounts();
    res.json(voteCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des votes' });
  }
});

module.exports = router;
