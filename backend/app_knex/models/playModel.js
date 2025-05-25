// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createPlay(id, play) {
  return await knex('Plays').insert({ play});
}

// Read
async function getAllPlays() {
  return await knex.select().from('Plays');
}

async function getPlayById(id) {
  return await knex('Plays').where({ id }).first();
}

// Update
async function updatePlay(id, newPlay) {
  return await knex('Plays').where({ id }).update({ play: newPlay });
}

// Delete
async function deletePlay(id) {
  return await knex('Plays').where({ id }).del();
}

module.exports = {
  createPlay,
  getAllPlays,
  getPlayById,
  updatePlay,
  deletePlay
};

// npm install knex sqlite3