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

// Créer un nouvel utilisateur
router.post('/teams', async (req, res) => {
  const { name, email } = req.body;
  try {
    await teamModel.createTeam(name, email);
    res.status(201).json({ message: 'Team créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une team existant
router.put('/teams/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await teamModel.updateTeam(id, name, email);
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

// Sign up
// router.post('/signup', async (req, res) => {
//   const { name, email, password} = req.body;
//   const encryptedPassword = crypto.createHash('md5').update(password).digest('hex');
//   const existingTeam = await teamModel.getTeamByEmail(email);
//   if (existingTeam) {
//     return res.status(409).json({ error: 'Utilisateur déjà existant' });
//   }
//   try {
//     await teamModel.createTeam(name, email, encryptedPassword);
//     res.status(201).json({ message: 'Utilisateur créé avec succès' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Sign in -- déterminer si l'utilisateur existe déjà avec findOne puis créer un token uuid, email 200 si ok et errueur 404 si non présent 
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const team = await teamModel.getTeamByEmail(email);
//     if (!team) {
//       return res.status(404).json({ error: 'Utilisateur non trouvé' });
//     }
//     const encryptedPassword = crypto.createHash('md5').update(password).digest('hex');
//     console.log('Mot de passe crypté:', encryptedPassword, team, password);
//     if (team.password !== encryptedPassword) {
//       return res.status(401).json({ error: 'Mot de passe incorrect' });
//     }
//     const token = uuidv4(); 
//     await tokenModel.createToken(token, email);
//     res.json({ message: 'Connexion réussie', token});
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// });

// Logout
// router.post('/logout', async (req, res) => {
//   const { token } = req.body;
//   try {
//     await tokenModel.deleteToken(token);
//     res.json({ message: 'Déconnexion réussie' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });




module.exports = router;
