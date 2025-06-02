// badgeRoutes.js
const express = require('express');
const router = express.Router();
const badgeModel = require('../models/badgeModel');


const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // récupère l'extension (.png, .jpg, ...)
    const uniqueName = Date.now() + ext; // timestamp + extension
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.put('/badges/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, title, description, vote_threshold } = req.body;
  const image = req.file ? req.file.filename : null; // Nom du fichier uploadé
  console.log({ id, name, title, description, image, vote_threshold }); 

  try {
    await badgeModel.updateBadge(id, name, title, description, image, vote_threshold);
    res.json({ message: 'Badge mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Récupérer tous les badges
router.get('/badges', async (req, res) => {
  try {
    const badges = await badgeModel.getAllBadges();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer une badge par ID
router.get('/badges/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const badge = await badgeModel.getBadgeById(id);
    res.json(badge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Créer un nouveau badge
router.post('/badges', async (req, res) => {
  const { id, name, title, description, image, vote_threshold} = req.body;
  try {
    await badgeModel.createBadge(id, name, title, description, image, vote_threshold);
    res.status(201).json({ message: 'Badge créé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour un badge existant
router.put('/badges/:id', async (req, res) => {
  const { id } = req.params;
  const { name,  title, description, image, vote_threshold } = req.body;
  try {
    await badgeModel.updateBadge(id, name, title, description, image, vote_threshold);
    res.json({ message: 'Badge mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un badge
router.delete('/badges/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await badgeModel.deleteBadge(id);
    res.json({ message: 'Badge supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
