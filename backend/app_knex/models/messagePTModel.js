// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);
const db = require('../db')
// Create
async function createMessagePT(message, date) {
  return await knex('MessagePTs').insert({ message, date });
}

// Read
async function getAllMessagesPTs() {
  return await knex.select().from('MessagesPT');
}

async function getMessages() {
  try {
    const messages = await db('messagesPT as m')
      .select(
        'm.id',
        'm.message',
        'm.date',
        'u.name as senderName',
        's.name as structure',
        's.country'
      )
      .leftJoin('users as u', 'm.user_id', 'u.id')
      .leftJoin('structures as s', 'u.structure_id', 's.id')
      .orderBy('m.date', 'desc');

    const messageIds = messages.map(msg => msg.id);

    const reactions = await db('reactions as r')
      .whereIn('r.messagePT_id', messageIds)
      .select('r.id', 'r.reaction', 'r.user_id', 'r.messagePT_id');

    const messagesWithReactions = messages.map(msg => ({
      ...msg,
      reactions: reactions.filter(r => r.messagePT_id === msg.id)
    }));

    return messagesWithReactions;
  } catch (error) {
    console.error('Erreur dans getMessages :', error);
    throw new Error("Erreur lors de la récupération des messages");
  }
}

async function getMessagePTById(id) {
  return await knex('MessagesPT').where({ id }).first();
}

async function getMessagesByUserId(userId) {
  return await knex('MessagesPT').where({ userId });
}

// Update
async function updateMessagePT(id, newMessage, newDate) {
  return await knex('MessagesPT').where({ id }).update({ message: newMessage, date: newDate });
}

// Delete
async function deleteMessagePT(id) {
  return await knex('MessagesPT').where({ id }).del();
}

module.exports = {
  createMessagePT,
  getAllMessagesPTs,
  getMessagePTById,
  updateMessagePT,
  deleteMessagePT,
  getMessagesByUserId,
  getMessages
};

// npm install knex sqlite3