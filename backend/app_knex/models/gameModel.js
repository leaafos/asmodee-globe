// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createGame(id, name, category_id, liked_id, score_id ) {
  return await knex('Games').insert({ name, category_id, liked_id, score_id });
}

// Read
async function getAllGames() {
  return await knex.select().from('Games');
}

async function getGameById(id) {
  return await knex('Games').where({ id }).first();
}

// Update
async function updateGame(id, newName, newCategoryId, newLikedId, newScoreId) {
  return await knex('Games').where({ id }).update({ name: newName, category_id: newCategoryId, liked_id: newLikedId, score_id: newScoreId });
}

// Delete
async function deleteGame(id) {
  return await knex('Games').where({ id }).del();
}

module.exports = {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame
};

// npm install knex sqlite3