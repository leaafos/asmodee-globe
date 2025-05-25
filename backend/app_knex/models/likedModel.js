// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createLiked(id, like) {
  return await knex('Likeds').insert({ like});
}

// Read
async function getAllLikeds() {
  return await knex.select().from('Likeds');
}

async function getLikedById(id) {
  return await knex('Likeds').where({ id }).first();
}

// Update
async function updateLiked(id, newLike) {
  return await knex('Likeds').where({ id }).update({ like: newLike });
}

// Delete
async function deleteLiked(id) {
  return await knex('Likeds').where({ id }).del();
}

module.exports = {
  createLiked,
  getAllLikeds,
  getLikedById,
  updateLiked,
  deleteLiked
};

// npm install knex sqlite3