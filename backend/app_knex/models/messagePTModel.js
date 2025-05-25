// db.js - Fichier pour gérer les opérations CRUD avec Knex
const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createMessagePT(message, date) {
  return await knex('MessagePTs').insert({ message, date });
}

// Read
async function getAllMessagesPTs() {
  return await knex.select().from('MessagesPT');
}

async function getMessagePTById(id) {
  return await knex('MessagesPT').where({ id }).first();
}

async function getMessagesByUserId(userId) {
  return await knex('MessagesPT').where({ userId });
}

// Update
async function updateMessagePT(id, newMessage, newDate) {
  return await knex('MessagesPT').where({ id }).update({ message: newMessage, date: newDate });
}

// Delete
async function deleteMessagePT(id) {
  return await knex('MessagesPT').where({ id }).del();
}

module.exports = {
  createMessagePT,
  getAllMessagesPTs,
  getMessagePTById,
  updateMessagePT,
  deleteMessagePT,
  getMessagesByUserId
};

// npm install knex sqlite3