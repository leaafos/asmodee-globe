// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createMessage(id, text) {
  return await knex('Messages').insert({ text});
}

// Read
async function getAllMessages() {
  return await knex('messages')
    .leftJoin('structures', 'messages.structure_id', 'structures.id')
    .select(
      'messages.id',
      'messages.text',
      'messages.structure_id',
      'structures.name as structure',
      'structures.country'
    )
    .orderBy('messages.id', 'desc');
}


async function getMessageById(id) {
  return await knex('Messages').where({ id }).first();
}

// Update
async function updateMessage(id, newText) {
  return await knex('Messages').where({ id }).update({ play: newText });
}

// Delete
async function deleteMessage(id) {
  return await knex('Messages').where({ id }).del();
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage
};

// npm install knex sqlite3