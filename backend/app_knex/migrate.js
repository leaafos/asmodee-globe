
const knex = require('knex')(require('./knexfile')['development']);

async function createTable() {
  try {
    const existsStructures = await knex.schema.hasTable('structures');
    if (!existsStructures) {
      await knex.schema.createTable('structures', table => {
        table.integer('id').primary();
        table.string('name');
        table.integer('staff');
        table.string('country');
        table.string('city');
        table.string('timeStart');
        table.string('timeEnd');
        table.string('website');
        table.decimal('latitude');
        table.decimal('longitude');
        table.integer('size');
      });
      console.log('La table "structures" a été créée avec succès.');
    } else {
      console.log('La table "structures" existe déjà.');
    }

    const existsBadges = await knex.schema.hasTable('badges');
    if (!existsBadges) {
      await knex.schema.createTable('badges', table => {
        table.increments('id').primary();
        table.string('name');
        table.string('title');
        table.string('description');
        table.string('image');
        table.integer('vote_threshold'); 
      });
      console.log('La table "badges" a été créée avec succès.');
    } else {
      console.log('La table "badges" existe déjà.');
    }

    const existsTeamBadges = await knex.schema.hasTable('team_badges'); // pour gérer relation many to many
    if (!existsTeamBadges) {
      await knex.schema.createTable('team_badges', table => {
        table.increments('id').primary();
        table.integer('team_id').unsigned().references('id').inTable('teams');
        table.integer('badge_id').unsigned().references('id').inTable('badges');
        table.integer('votes').defaultTo(0);
        table.boolean('unlocked').defaultTo(false);
      });
      console.log('La table "team_badges" a été créée avec succès.');
    } else {
      console.log('La table "team_badges" existe déjà.');
}

    const existsCategories = await knex.schema.hasTable('categories');
    if (!existsCategories) {
      await knex.schema.createTable('categories', table => {
        table.increments('id').primary();
        table.string('name');
      });
      console.log('La table "categories" a été créée avec succès.');
    } else {
      console.log('La table "categories" existe déjà.');
    }

    const existsTeams = await knex.schema.hasTable('teams');
    if (!existsTeams) {
      await knex.schema.createTable('teams', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('badgeTeam_id').unsigned();
        table.foreign('badgeTeam_id').references('id').inTable('team_badges');
        table.integer('structure_id').unsigned();
        table.foreign('structure_id').references('id').inTable('structures');
        table.integer('staff');
      });
      console.log('La table "teams" a été créée avec succès.');
    } else {
      console.log('La table "teams" existe déjà.');
    }

    const existsUsers = await knex.schema.hasTable('users');
    if (!existsUsers) {
      await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name');
        table.string('surname');
        // table.string('email');
        // table.string('password');
        table.string('jobTitle');
        table.integer('structure_id').unsigned()
        table.foreign('structure_id').references('id').inTable('structures');
        table.integer('team_id').unsigned()
        table.foreign('team_id').references('id').inTable('teams');
        table.integer('score_id').unsigned()
        table.foreign('score_id').references('id').inTable('scores');
        table.integer('liked_id').unsigned()
        table.foreign('liked_id').references('id').inTable('liked');
        table.string('image');
        table.string('role');
      });
      console.log('La table "users" a été créée avec succès.');
    } else {
      console.log('La table "users" existe déjà.');
    }

    const existsGames = await knex.schema.hasTable('games');
    if (!existsGames) {
      await knex.schema.createTable('games', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('score_id').unsigned()
        table.foreign('score_id').references('id').inTable('scores');
        table.integer('liked_id').unsigned()
        table.foreign('liked_id').references('id').inTable('liked');
        table.integer('category_id').unsigned()
        table.foreign('category_id').references('id').inTable('categories');
        table.string('image');
      });
      console.log('La table "games" a été créée avec succès.');
    } else {
      console.log('La table "games" existe déjà.');
    }

    const existsLiked = await knex.schema.hasTable('liked');
    if (!existsLiked) {
      await knex.schema.createTable('liked', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('id').inTable('users');
        table.integer('game_id').unsigned().references('id').inTable('games');
      });
      console.log('La table "liked" a été créée avec succès.');
    } else {
      console.log('La table "liked" existe déjà.');
    }

    const existsScores = await knex.schema.hasTable('scores');
    if (!existsScores) {
      await knex.schema.createTable('scores', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('id').inTable('users');
        table.integer('score');
        table.string('date');
        // table.string('image');
        table.integer('game_id').unsigned()
        table.foreign('game_id').references('id').inTable('games');
        table.integer('play_id').unsigned()
        table.foreign('play_id').references('id').inTable('plays');
        table.integer('ranking');
      });
      console.log('La table "scores" a été créée avec succès.');
    } else {
      console.log('La table "scores" existe déjà.');
    }

    const existsPlays = await knex.schema.hasTable('plays');
    if (!existsPlays) {
      await knex.schema.createTable('plays', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('id').inTable('users');
        table.integer('score_id').unsigned()
        table.foreign('score_id').references('id').inTable('scores');
        table.integer('game_id').unsigned()
        table.foreign('game_id').references('id').inTable('games');
      });
      console.log('La table "plays" a été créée avec succès.');
    } else {
      console.log('La table "plays" existe déjà.');
    }

    const existsMessages = await knex.schema.hasTable('messages');
    if (!existsMessages) {
      await knex.schema.createTable('messages', table => {
        table.increments('id').primary();
        table.string('text');
        table.integer('structure_id').unsigned()
        table.foreign('structure_id').references('id').inTable('structures');
      });
      console.log('La table "messages" a été créée avec succès.');
    } else {
      console.log('La table "messages" existe déjà.');
    }

    const existsMessagesPT = await knex.schema.hasTable('messagesPT');
    if (!existsMessagesPT) {
      await knex.schema.createTable('messagesPT', table => {
        table.increments('id').primary();
        table.integer('team_id').unsigned()
        table.foreign('team_id').references('id').inTable('teams');
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('id').inTable('users');
        table.string('message');
        table.timestamp('date');
        table.integer('reaction_id').unsigned()
        table.foreign('reaction_id').references('id').inTable('reactions');
      });
      console.log('La table "messagesPT" a été créée avec succès.');
    } else {
      console.log('La table "messagesPT" existe déjà.');
    }

    const existsReactions = await knex.schema.hasTable('reactions');
    if (!existsReactions) {
      await knex.schema.createTable('reactions', table => {
        table.increments('id').primary();
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('id').inTable('users');
        table.string('reaction');
        table.integer('messagePT_id').unsigned()
        table.foreign('messagePT_id').references('id').inTable('messagesPT');
      });
      console.log('La table "reactions" a été créée avec succès.');
    } else {
      console.log('La table "reactions" existe déjà.');
    }

    const existsSinkOrSail = await knex.schema.hasTable('sinkOrSail');
    if (!existsSinkOrSail) {
      await knex.schema.createTable('sinkOrSail', table => {
        table.increments('id').primary();
        table.integer('game_id').unsigned()
        table.foreign('game_id').references('id').inTable('games');
        table.integer('vote');
        table.string('time');
        table.integer('season');
      });
      console.log('La table "sinkOrSail" a été créée avec succès.');
    } else {
      console.log('La table "sinkOrSail" existe déjà.');
    }

  } catch (error) {
    console.error('Erreur lors de la création des tables :', error);
  } finally {
    await knex.destroy();
  }
}

createTable();
