// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createReaction(reaction) {
  return await knex('Reactions').insert({ reaction});
}

// Read
async function getAllReactions() {
  return await knex.select().from('Reactions');
}

async function getReactionById(id) {
  return await knex('Reactions').where({ id }).first();
}

// Update
async function updateReaction(id, newReaction) {
  return await knex('Reactions').where({ id }).update({ reaction: newReaction });
}

// Delete
async function deleteReaction(id) {
  return await knex('Reactions').where({ id }).del();
}

module.exports = {
  createReaction,
  getAllReactions,
  getReactionById,
  updateReaction,
  deleteReaction
};

// npm install knex sqlite3