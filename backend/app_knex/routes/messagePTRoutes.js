const express = require('express');
const router = express.Router();
const messageModel = require('../models/messagePTModel');
const reactionModel = require('../models/reactionModel');
const userModel = require('../models/userModel');


// Middleware pour simuler un utilisateur connecté (à remplacer par auth réelle)
async function getUserFromRequest(req) {
  const userId = req.header('x-user-id'); // Simulé
  return await userModel.getUserById(userId);
}

// Créer un message (rôle "A" uniquement)
router.post('/messages', async (req, res) => {
  const { content } = req.body;
  const user = await getUserFromRequest(req);

  if (!user || user.role !== 'A') {
    return res.status(403).json({ error: 'Permission refusée' });
  }

  try {
    const message = await messageModel.createMessage(user.id, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir tous les messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await messageModel.getAllMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/my-messages', async (req, res) => {
  const user = await getUserFromRequest(req);

  if (!user) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const messages = await messageModel.getMessagesByUserId(user.id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modifier un message (seulement l’auteur)
router.put('/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = await getUserFromRequest(req);

  const message = await messageModel.getMessageById(id);
  if (!message || message.user_id !== user.id) {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  try {
    await messageModel.updateMessage(id, content);
    res.json({ message: 'Message mis à jour' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un message (seulement l’auteur)
router.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  const user = await getUserFromRequest(req);

  const message = await messageModel.getMessageById(id);
  if (!message || message.user_id !== user.id) {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  try {
    await messageModel.deleteMessage(id);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Réagir à un message (tout le monde peut)
router.post('/messages/:id/reactions', async (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;
  const user = await getUserFromRequest(req);

  try {
    await reactionModel.createReaction(id, user.id, emoji);
    res.status(201).json({ message: 'Réaction ajoutée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
