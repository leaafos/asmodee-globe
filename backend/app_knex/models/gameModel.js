// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createGame(id, name) {
  return await knex('Games').insert({ name});
}

// Read
async function getAllGames() {
  return await knex.select().from('Games');
}

async function getGameById(id) {
  return await knex('Games').where({ id }).first();
}

// Update
async function updateGame(id, newName) {
  return await knex('Games').where({ id }).update({ play: newName });
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