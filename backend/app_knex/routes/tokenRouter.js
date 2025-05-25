// tokenRoutes.js
const express = require('express');
const router = express.Router();
const tokenModel = require('./models/tokenModel');

// Récupérer tous les tokens
router.get('/token', async (req, res) => {
  try {
    const tokens = await tokenModel.getAllTokens();
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un token par ID
router.get('/tokens/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const token = await tokenModel.getTokenById(id);
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau token
router.post('/tokens', async (req, res) => {
  const { token, email } = req.body;
  try {
    await tokenModel.createToken(token, email);
    res.status(201).json({ message: 'Token créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un token existant
router.put('/tokens/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    //await tokenModel.updateToken(id, token, email);
    res.json({ message: 'Token mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un token
router.delete('/tokens/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await tokenModel.deleteUser(id);
    res.json({ message: 'Token supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
