// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createBadge(id, name, title, description, image, vote_threshold) {
  return await knex('Badges').insert({  name, title, description, image, vote_threshold});
}

// Read
async function getAllBadges() {
  return await knex.select().from('Badges');
}

async function getBadgeById(id) {
  return await knex('Badges').where({ id }).first();
}

// Update
async function updateBadge(id, newName, newTitle, newDescription, newImage, newVote_threshold) {
  return await knex('Badges').where({ id }).update({ name: newName, title: newTitle, description: newDescription, image: newImage, vote_threshold: newVote_threshold });
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