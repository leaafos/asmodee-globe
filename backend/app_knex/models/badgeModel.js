// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createBadge(id, name, tittle, description, image, vote) {
  return await knex('Badges').insert({  name, tittle, description, image, vote});
}

// Read
async function getAllBadges() {
  return await knex.select().from('Badges');
}

async function getBadgeById(id) {
  return await knex('Badges').where({ id }).first();
}

// Update
async function updateBadge(id, newName, newTittle, newDescription, newImage, newVote) {
  return await knex('Badges').where({ id }).update({ play: newName, tittle: newTittle, description: newDescription, image: newImage, vote: newVote });
}

// Delete
async function deleteBadge(id) {
  return await knex('Badges').where({ id }).del();
}

module.exports = {
  createBadge,
  getAllBadges,
  getBadgeById,
  updateBadge,
  deleteBadge
};

// npm install knex sqlite3