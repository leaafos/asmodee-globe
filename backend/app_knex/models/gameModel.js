// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);
const db = require('../db')

// Create
async function createGame(id, name, category_id, image ) {
  return await knex('Games').insert({ name, category_id, image });
}

// Read
async function getAllGames() {
  return await knex.select().from('Games');
}

async function getGamesWithCategories() {
  return await db('games as g')
    .leftJoin('categories as c', 'g.category_id', 'c.id')
    .select(
      'g.id',
      'g.name',
      'g.category_id',
      'c.name as category_name',
      'g.image'
    );
}

async function getGameById(id) {
  return await knex('Games').where({ id }).first();
}

// Update
async function updateGame(id, newName, newCategoryId,newImage) {
  return await knex('Games').where({ id }).update({ name: newName, category_id: newCategoryId, image: newImage });
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
  deleteGame,
  getGamesWithCategories
};

// npm install knex sqlite3