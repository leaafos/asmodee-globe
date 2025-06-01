import React, { useEffect, useState } from "react";

const SinkOrSail = () => {
  const [games, setGames] = useState([]);
  const [votes, setVotes] = useState({});
  const [voteCounts, setVoteCounts] = useState({});
  const [message, setMessage] = useState("");

  const maxVotes = 5;
  const remainingVotes = maxVotes - Object.keys(votes).length;

  useEffect(() => {
    // Charger les jeux sélectionnés et les votes
    fetch("http://localhost/selected")
      .then((res) => res.json())
      .then(setGames)
      .catch((err) =>
        console.error("Erreur chargement jeux SinkOrSail :", err)
      );

    refreshVotes();
  }, []);

  const refreshVotes = () => {
    fetch("http://localhost/votes/counts")
      .then((res) => res.json())
      .then((data) => {
        const formatted = {};
        data.forEach((v) => {
          formatted[v.game_id] = v.total_votes;
        });
        setVoteCounts(formatted);
      })
      .catch((err) =>
        console.error("Erreur chargement des votes :", err)
      );
  };

  const handleVote = async (gameId) => {
    if (votes[gameId] || remainingVotes <= 0) return;

    const payload = {
      game_id: gameId,
      vote: 1,
      time: new Date().toISOString(),
      season: 1,
    };

    try {
      const res = await fetch("http://localhost/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setVotes((prev) => ({ ...prev, [gameId]: true }));
        setMessage("Vote enregistré !");
        refreshVotes(); // 🔁 recharge les totaux
      } else {
        setMessage(data.error || "Erreur lors du vote.");
      }
    } catch (err) {
      console.error("Erreur requête vote :", err);
      setMessage("Erreur réseau.");
    }
  };

  return (
    <div className="sink-or-sail">
      <h2>Sink or Sail</h2>
      <p>Vote pour 5 jeux maximum. Votes restants : {remainingVotes}</p>
      {message && <p className="feedback">{message}</p>}

      <div className="games-grid">
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <h3>{game.name}</h3>
            <img
              src={`http://localhost/uploads/${game.image}`}
              alt={game.name}
              style={{ width: "150px", height: "150px" }}
            />
            <p>Votes totaux : {voteCounts[game.id] || 0}</p>
            <button
              disabled={votes[game.id] || remainingVotes <= 0}
              onClick={() => handleVote(game.id)}
            >
              {votes[game.id] ? "Déjà voté" : "Voter"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinkOrSail;
