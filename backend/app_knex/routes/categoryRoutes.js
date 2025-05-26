// categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryModel = require('../models/categoryModel');

// Récupérer tous les categoruies
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une category par ID
router.get('/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryModel.getCategoryById(id);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau jeu
router.post('/categories', async (req, res) => {
  const { id, name} = req.body;
  try {
    await categoryModel.createCategory(id, name);
    res.status(201).json({ message: 'Catégorie créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un jeu existant
router.put('/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await categoryModel.updateCategory(id, name);
    res.json({ message: 'Categorie mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un jeu
router.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await categoryModel.deleteCategory(id);
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
