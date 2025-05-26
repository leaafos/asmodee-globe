const express = require('express');
const router = express.Router();
const messageModel = require('../models/messageModel');
const userModel = require('../models/userModel');
const structureModel = require('../models/structureModel');


// // Middleware pour simuler un utilisateur connecté (à remplacer par auth réelle)
// async function getUserFromRequest(req) {
//   const userId = req.header('x-user-id'); // Simulé
//   return await userModel.getUserById(userId);
// }


// Obtenir tous les messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await messageModel.getAllMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// créer un message
router.post('/messages', async (req, res) => {
  const { id, text } = req.body;
  try {
    await messageModel.createMessage(id, text);
    res.status(201).json({ message: 'Message créée avec succès' });
  } catch (error) {
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
      message: 'Message envoyé avec succès',
      from: user.name,
      structure: structure.name,
      country: structure.country,
      content: message.content
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});






module.exports = router;
