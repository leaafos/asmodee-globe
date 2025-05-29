// teamRoutes.js
const express = require('express');
const router = express.Router();
const teamModel = require('../models/teamModel');

// Récupérer tous les teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await teamModel.getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une team par ID
router.get('/teams/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const team = await teamModel.getTeamById(id);
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer une nouvelle team
router.post('/teams', async (req, res) => {
  const { name, badgeTeam_id, structure_id, staff } = req.body;
  try {
    await teamModel.createTeam(name, badgeTeam_id, structure_id, staff);
    res.status(201).json({ message: 'Team créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une team existante
router.put('/teams/:id', async (req, res) => {
  const { id } = req.params;
  const { name, badgeTeam_id, structure_id, staff } = req.body;
  try {
    await teamModel.updateTeam(id, name, badgeTeam_id, structure_id, staff);
    res.json({ message: 'Team mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une team
router.delete('/teams/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await teamModel.deleteTeam(id);
    res.json({ message: 'Team supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
