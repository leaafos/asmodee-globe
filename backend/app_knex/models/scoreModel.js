const db = require('../db');

async function getScoresByUser(userId) {
  return db('scores')
    .where('user_id', userId)
    .join('games', 'scores.game_id', 'games.id')
    .select(
      'scores.id',
      'scores.score',
      'scores.date',
      'scores.ranking',
      'games.name as game_name'
    );
}

async function getScoresByUserId(userId) {
  return getScoresByUser(userId);
}

async function addScore({ user_id, game_id, score, date, play_id, ranking }) {
  return db('scores').insert({
    user_id,
    game_id,
    score,
    date,
    play_id,
    ranking,
  });
}

async function getTotalScore(userId) {
  const result = await db('scores')
    .where('user_id', userId)
    .sum('score as totalScore')
    .first();
  return result.totalScore || 0;
}

/**
 * Récupère le classement global des scores avec les infos utilisateurs et structure.
 * @param {number} currentUserId - L'id de l'utilisateur connecté.
 * @returns {Array} Liste des scores avec nom personnalisé et infos structure.
 */
async function getRanking(currentUserId) {
  const scores = await db('scores')
    .join('users', 'scores.user_id', 'users.id')
    .leftJoin('structures', 'users.structure_id', 'structures.id')
    .select(
      'scores.user_id',
      'users.name as user_name',
      'users.jobtitle as user_jobtitle',
      'users.surname as user_surname',
      'structures.city',
      'structures.country'
    )
    .sum('scores.score as total_score')
    .groupBy(
      'scores.user_id',
      'users.name',
      'users.jobtitle',
      'users.surname',
      'structures.city',
      'structures.country'
    )
    .orderBy('total_score', 'desc');

  return scores.map((score, index) => ({
    user_id: score.user_id,
    score: score.total_score,
    ranking: index + 1,
    name: score.user_id === currentUserId
      ? 'Me'
      : `${score.user_surname} ${score.user_name} – ${score.user_jobtitle || ''} (${score.city || ''}, ${score.country || ''})`,
  }));
}

module.exports = {
  getScoresByUser,
  getScoresByUserId,
  addScore,
  getTotalScore,
  getRanking,
};
