// structureRoutes.js
const express = require('express');
const router = express.Router();
const structureModel = require('../models/structureModel');

// Récupérer toutes les structures
router.get('/structures', async (req, res) => {
  try {
    const structures = await structureModel.getAllStructures();
    res.json(structures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une structure par ID
router.get('/structures/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const structure = await structureModel.getStructureById(id);
    res.json(structure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouvel utilisateur
router.post('/structures', async (req, res) => {
  const { name, email } = req.body;
  try {
    await structureModel.createStructure(name, email);
    res.status(201).json({ message: 'Structure créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une structure existant
router.put('/structures/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await structureModel.updateStructure(id, name, email);
    res.json({ message: 'Structure mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une structure
router.delete('/structures/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await structureModel.deleteStructure(id);
    res.json({ message: 'Structure supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
