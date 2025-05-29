// userRoutes.js
const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
// const tokenModel = require('./models/tokenModel');
// const crypto = require('crypto');
// const { v4: uuidv4 } = require('uuid');

// Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un utilisateur par ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouvel utilisateur
router.post('/users', async (req, res) => {
  const { name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role } = req.body;
  try {
    await userModel.createUser(name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role);
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un utilisateur existant
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { surname } = req.body;
  const { jobTitle } = req.body;
  const { structure_id } = req.body;
  const { team_id } = req.body;
  const { score_id } = req.body;
  const { liked_id } = req.body;
  const { image } = req.body;
  const { role } = req.body;
  try {
    await userModel.updateUser(id, name, surname, jobTitle, structure_id, team_id, score_id, liked_id, image, role);
    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await userModel.deleteUser(id);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Sign up
// router.post('/signup', async (req, res) => {
//   const { name, email, password} = req.body;
//   const encryptedPassword = crypto.createHash('md5').update(password).digest('hex');
//   const existingUser = await userModel.getUserByEmail(email);
//   if (existingUser) {
//     return res.status(409).json({ error: 'Utilisateur déjà existant' });
//   }
//   try {
//     await userModel.createUser(name, email, encryptedPassword);
//     res.status(201).json({ message: 'Utilisateur créé avec succès' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Sign in -- déterminer si l'utilisateur existe déjà avec findOne puis créer un token uuid, email 200 si ok et errueur 404 si non présent 
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await userModel.getUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ error: 'Utilisateur non trouvé' });
//     }
//     const encryptedPassword = crypto.createHash('md5').update(password).digest('hex');
//     console.log('Mot de passe crypté:', encryptedPassword, user, password);
//     if (user.password !== encryptedPassword) {
//       return res.status(401).json({ error: 'Mot de passe incorrect' });
//     }
//     const token = uuidv4(); 
//     await tokenModel.createToken(token, email);
//     res.json({ message: 'Connexion réussie', token});
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// });

// Sign in -- déterminer si l'utilisateur existe déjà avec findOne 
router.post('/login', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Le prénom est requis.' });
  }

  try {
    const user = await userModel.getUserByName(name);

    if (!user || user.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(404).json({ error: 'Utilisateur non trouvé ou prénom incorrect.' });
    }

    // Pour une démo, tu peux renvoyer des infos utiles au front
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.name,
        structure_id: user.structure_id,
        team_id: user.team_id,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur dans /login:', error); 
    res.status(500).json({ error: error.message });
  }
});


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
