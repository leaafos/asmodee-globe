const db = require('../db'); // adapte le chemin selon ta config knex

module.exports = {
  // Récupérer les jeux likés d’un utilisateur avec les détails du jeu et sa catégorie
  async getLikedByUser(userId) {
    return db('liked')
      .join('games', 'liked.game_id', 'games.id')
      .join('categories', 'games.category_id', 'categories.id')
      .where('liked.user_id', userId)
      .select(
        'games.id',
        'games.name',
        'categories.name as category_name',
        'games.image'
      );
  },

  // Ajouter un like
  async addLiked(userId, gameId) {
    // Evite les doublons (optionnel)
    const exists = await db('liked')
      .where({ user_id: userId, game_id: gameId })
      .first();
    if (!exists) {
      return db('liked').insert({ user_id: userId, game_id: gameId });
    }
    return null;
  },

  // Supprimer un like
  async removeLiked(userId, gameId) {
    return db('liked')
      .where({ user_id: userId, game_id: gameId })
      .del();
  }
};
