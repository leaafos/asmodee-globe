const express = require('express');
//const knex = require('../db'); 
const db = require('../db'); 
const router = express.Router();
const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const structureModel = require('../models/structureModel');



// Obtenir tous les messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await messageModel.getAllMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/messages', async (req, res) => {
  const { text, structure_id } = req.body;

  try {
    const [id] = await db('messages').insert({ text, structure_id }).returning('id');

    const message = await db('messages')
      .where({ 'messages.id': id })
      .join('structures', 'messages.structure_id', 'structures.id')
      .select(
        'messages.id',
        'messages.text',
        'structures.name as structure',
        'structures.country',
        'structures.city',
        'structures.latitude as lat',
        'structures.longitude as lng',
        'structures.website'
      )
      .first();

    res.json(message);
  } catch (err) {
    console.error("Erreur création message :", err);
    res.status(500).json({ error: "Erreur lors de la création du message." });
  }
});

// créer un message
// router.post('/messages', async (req, res) => {
//   const { id, text } = req.body;
//   try {
//     await messageModel.createMessage(id, text);
//     res.status(201).json({ message: 'Message créée avec succès' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Route pour récupérer tous les messages persistants
router.get('/projected-messages', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM projected_messages ORDER BY created_at DESC LIMIT 5'); // Récupérer les 5 derniers messages
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages projetés:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour ajouter un nouveau message persistant
router.post('/projected-messages', async (req, res) => {
  const { text, lat, lng, sender_structure, sender_country } = req.body;
  if (!text || !lat || !lng || !sender_structure || !sender_country) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO projected_messages (text, lat, lng, sender_structure, sender_country) VALUES (?, ?, ?, ?, ?)',
      [text, lat, lng, sender_structure, sender_country]
    );
    // Supprimer le plus ancien message si plus de 5 messages existent
    await db.execute(`
      DELETE FROM projected_messages
      WHERE id NOT IN (SELECT id FROM (SELECT id FROM projected_messages ORDER BY created_at DESC LIMIT 5) as sub)
    `);

    res.status(201).json({ message: 'Message projeté ajouté avec succès', id: result.insertId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du message projeté:', error);
    res.status(500).json({ error: error.message });
  }
});
// Envoyer un message prédéfini en tant qu'utilisateur connecté
router.post('/send-message', async (req, res) => {
  const { id, user_id } = req.body;

  try {
    const user = await userModel.getUserById(user_id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });


    const structure = await structureModel.getStructureById(user.structure_id);
    if (!structure) return res.status(404).json({ error: 'Structure non trouvée' });

    const message = await messageModel.getMessageById(id);
    if (!message) return res.status(404).json({ error: 'Message non trouvé' });

    // Associe l'utilisateur et le message
    const sentMessage = {
      user_id: user.id,
      message_id: message.id,
      structure_name: structure.name,
      country: structure.country,
      content: message.content
    };

    // Ici tu peux enregistrer sentMessage dans ta base si besoin

    res.status(200).json({
      message: message.text,
      structure: structure.name,
      country: structure.country,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Supprimer un message
router.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await messageModel.deleteMessage(id);
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
