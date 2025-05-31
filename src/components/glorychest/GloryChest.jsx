import React, { useEffect, useState } from "react";
import "./gloryChest.scss";
import TeamBadgeForm from "./Form";

const GloryChest = () => {
  const [teamId, setTeamId] = useState(null);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [pendingBadges, setPendingBadges] = useState([]);
  const [othersPendingBadges, setOthersPendingBadges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [voteMessage, setVoteMessage] = useState(null);
  const [voteError, setVoteError] = useState(null);

  useEffect(() => {
    // Récupérer user depuis localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setTeamId(user.teamId || user.team_id);
    }
  }, []);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamBadges = async () => {
      try {
        // Récupérer badges débloqués de l'équipe
        const resUnlocked = await fetch(`http://localhost/teamBadges/unlocked/${teamId}`);
        if (!resUnlocked.ok) throw new Error("Erreur lors de la récupération des badges débloqués");
        const unlockedData = await resUnlocked.json();
        setUnlockedBadges(unlockedData);

        // Récupérer badges en cours (non débloqués) de l'équipe
        const resPending = await fetch(`http://localhost/teamBadges/pending/${teamId}`);
        if (!resPending.ok) throw new Error("Erreur lors de la récupération des badges en cours");
        const pendingData = await resPending.json();
        setPendingBadges(pendingData);

        // Récupérer badges en cours des autres équipes
        const resOthers = await fetch(`http://localhost/teamBadges/pending/exclude/${teamId}`);
        if (!resOthers.ok) throw new Error("Erreur lors de la récupération des badges des autres équipes");
        const othersData = await resOthers.json();
        setOthersPendingBadges(othersData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeamBadges();
  }, [teamId]);

  // Fonction pour voter sur un badge d'une autre équipe
  const handleVote = async (teamBadgeId) => {
    setVoteMessage(null);
    setVoteError(null);

    try {
      const res = await fetch(`http://localhost/teamBadges/vote/${teamBadgeId}`, {
        method: "POST",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur lors du vote");
      }
      setVoteMessage("Vote enregistré !");
      // Mettre à jour les listes pour rafraîchir l'affichage
      // On refait le fetch des badges en cours des autres équipes et de la nôtre
      const resPending = await fetch(`http://localhost/teamBadges/pending/exclude/${teamId}`);
      const othersData = await resPending.json();
      setOthersPendingBadges(othersData);

      const resTeamPending = await fetch(`http://localhost/teamBadges/pending/${teamId}`);
      const teamPendingData = await resTeamPending.json();
      setPendingBadges(teamPendingData);
    } catch (err) {
      setVoteError(err.message);
    }
  };

  return (
    <div id="gloryContainer">
      <h2>Glory Chest de la team {teamId}</h2>
      <button onClick={() => setShowForm(true)}>Soumettre un badge</button>
      {showForm && <TeamBadgeForm />}

      <section>
        <h3>Badges débloqués</h3>
        {unlockedBadges.length === 0 ? (
          <p>Aucun badge débloqué.</p>
        ) : (
          unlockedBadges.map((badge) => (
            <div key={badge.id} className="badge-card">
              <h4>{badge.badge_name}</h4>
              <p>{badge.description}</p>
              <img
                src={`http://localhost/uploads/${badge.image}`}
                alt={badge.badge_name}
                style={{ width: "100px", height: "100px" }}
              />
              <p>Votes : {badge.votes}</p>
              <p>Débloqué : Oui</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Badges en cours de vote</h3>
        {pendingBadges.length === 0 ? (
          <p>Aucun badge en cours de vote.</p>
        ) : (
          pendingBadges.map((badge) => (
            <div key={badge.id} className="badge-card">
              <h4>{badge.badge_name}</h4>
              <p>{badge.description}</p>
              <img
                src={`http://localhost/uploads/${badge.image}`}
                alt={badge.badge_name}
                style={{ width: "100px", height: "100px" }}
              />
              <p>
                Votes : {badge.votes} / {badge.vote_threshold} (
                {badge.vote_threshold - badge.votes} votes manquants)
              </p>
              <p>Débloqué : Non</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Pirat's Council - Voter pour les badges des autres équipes</h3>
        {voteMessage && <p style={{ color: "green" }}>{voteMessage}</p>}
        {voteError && <p style={{ color: "red" }}>{voteError}</p>}

        {othersPendingBadges.length === 0 ? (
          <p>Aucun badge à voter pour les autres équipes.</p>
        ) : (
          othersPendingBadges.map((badge) => (
            <div key={badge.id} className="badge-card">
              <h4>{badge.badge_name}</h4>
              <p>Équipe : {badge.team_name}</p>
              <p>{badge.description}</p>
              <img
                src={`http://localhost/uploads/${badge.image}`}
                alt={badge.badge_name}
                style={{ width: "100px", height: "100px" }}
              />
              <p>
                Votes : {badge.votes} / {badge.vote_threshold} (
                {badge.vote_threshold - badge.votes} votes manquants)
              </p>
              <button onClick={() => handleVote(badge.id)}>Voter</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default GloryChest;
