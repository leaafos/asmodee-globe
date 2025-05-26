// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createToken(token, email) {
  return await knex('tokens').insert({token, email});
}

// Read
async function getAllTokens() {
  return await knex.select().from('tokens');
}

async function getTokenById(id) {
  return await knex('tokens').where({ id }).first();
}

// Update
async function updateToken(token, email) {
  //return await knex('tokens').where({ id }).update({ token : newToken, email: newEmail });
}

// Delete
async function deleteToken(token) {
  return await knex('tokens').where({ token }).del();
}

module.exports = {
  createToken,
  getAllTokens,
  getTokenById,
  updateToken,
  deleteToken
};

// npm install knex sqlite3