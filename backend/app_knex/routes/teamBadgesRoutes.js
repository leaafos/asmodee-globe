// teamBadgeBadgeRoutes.js
const express = require('express');
const router = express.Router();
const teamBadgeModel = require('../models/teamBadgeModel');


// Récupérer tous les teamBadges
router.get('/teamBadges', async (req, res) => {
  try {
    const teamBadges = await teamBadgeModel.getAllTeamBadges();
    res.json(teamBadges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les badges d'une team par userId en attente
router.get('/teamBadges/pending/:teamId', async (req, res) => {
  const { teamId } = req.params;
  try {
    const pendingBadges = await teamBadgeModel.getPendingBadgesByTeamId(teamId);
    res.json(pendingBadges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les badges d'une team par teamId débloqués
router.get('/teamBadges/unlocked/:teamId', async (req, res) => {
  const { teamId } = req.params;
  try {
    const unlockedBadges = await teamBadgeModel.getUnlockedBadgesByTeamId(teamId);
    res.json(unlockedBadges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les badges d'une team par teamId en attente, mais excluant les badges de l'équipe elle-même
router.get('/teamBadges/pendingOthers/:teamId', async (req, res) => {
  const { teamId } = req.params;
  try {
    const pendingOthersBadges = await teamBadgeModel.getPendingBadgesExcludingTeam(teamId);
    res.json(pendingOthersBadges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter un vote à un teamBadge
router.post('/teamBadges/:id/vote', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // optionnel si tu veux vérifier que l'utilisateur n'a pas déjà voté

  try {
    // Ici tu peux vérifier si userId a déjà voté sur ce teamBadgeId pour éviter votes multiples (optionnel)
    // await teamBadgeModel.checkUserVote(id, userId);

    await teamBadgeModel.addVote(id, userId);

    res.json({ message: 'Vote ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les badges d'une équipe par teamId
router.get('/teams/:teamId/badges', async (req, res) => {
  const { teamId } = req.params;
  try {
    const badges = await teamBadgeModel.getBadgesByTeamId(teamId);
    res.json(badges);
  } catch (err) {
    console.error('Erreur dans /teams/:teamId/badges:', err.stack || err);  // <-- log complet
    res.status(500).json({ error: 'Erreur lors de la récupération des badges de l’équipe' });
  }
});

// Récupérer une teamBadge par ID
router.get('/teamBadges/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teamBadge = await teamBadgeModel.getTeamBadgeById(id);
    res.json(teamBadge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer une nouvelle teamBadge
router.post('/teamBadges', async (req, res) => {
  const { team_id, badge_id, votes, unlocked} = req.body;
  try {
    await teamBadgeModel.createTeamBadge( team_id, badge_id, votes, unlocked);
    res.status(201).json({ message: 'teamBadge créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Mettre à jour une teamBadge existante
router.put('/teamBadges/:id', async (req, res) => {
  const { id } = req.params;
  const {team_id, badge_id, votes, unlocked } = req.body;
  try {
    await teamBadgeModel.updateTeamBadge(id, team_id, badge_id, votes, unlocked);
    res.json({ message: 'teamBadge mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une teamBadge
router.delete('/teamBadges/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await teamBadgeModel.deleteTeamBadge(id);
    res.json({ message: 'teamBadge supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
