// productRoutes.js
const express = require('express');
const router = express.Router();
const productModel = require('./models/messagePTModel');

// Récupérer tous les produits
router.get('/products', async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un produit par ID
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.getProductById(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau produit
router.post('/products', async (req, res) => {
  const { name, price } = req.body;
  try {
    await productModel.createProduct(name, price);
    res.status(201).json({ message: 'Produit créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un produit existant
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    await productModel.updateProduct(id, name, price);
    res.json({ message: 'Produit mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un produit
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await productModel.deleteUser(id);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
