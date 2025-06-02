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

// récupérer une structure depuis userId
router.get('/structures/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const structure = await structureModel.getStructureByUserId(userId);
    res.json(structure);
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

// Créer une nouvelle structure
router.post('/structures', async (req, res) => {
  const { name, staff, country, city, timeStart, timeEnd, website, latitude, longitude, size } = req.body;
  try {
    await structureModel.createStructure(name, staff, country, city, timeStart, timeEnd, website, latitude, longitude, size);
    res.status(201).json({ message: 'Structure créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une structure existante
router.put('/structures/:id', async (req, res) => {
  const { id } = req.params;
  const { name, staff, country, city, timeStart, timeEnd, website, latitude, longitude, size} = req.body;
  try {
    await structureModel.updateStructure(id, name, staff, country, city, timeStart, timeEnd, website, latitude, longitude, size );
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
