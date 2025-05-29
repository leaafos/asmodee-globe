import React, { useEffect, useState } from "react";
import "./gloryChest.scss";

const GloryChest = () => {
  const [badges, setBadges] = useState([]);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    // Récupérer user depuis localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setTeamId(user.teamId || user.team_id); // Essaie les deux cas possibles
    }
  }, []);

  useEffect(() => {
    if (!teamId) return;

    const fetchBadges = async () => {
      try {
        const res = await fetch(`http://localhost/teams/${teamId}/badges`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des badges");
        const data = await res.json();
        setBadges(data);
      } catch (err) {
        console.error('Erreur dans /teams/:teamId/badges :', err); // Ajout du log d’erreur
        console.error(err);
      }
    };

    fetchBadges();
  }, [teamId]);

  return (
    <div id="gloryContainer">
      <h2>Badges de la team {teamId}</h2>
      <div className="badges-list">
        {badges.length === 0 && <p>Aucun badge trouvé.</p>}
        {badges.map((badge) => (
          <div key={badge.id} className="badge-card">
            <h3>{badge.name}</h3>
            <p>{badge.description}</p>
            <img
              src={`http://localhost/uploads/${badge.image}`}
              alt={badge.name}
              style={{ width: "100px", height: "100px" }}
            />
            <p>Votes : {badge.votes}</p>
            <p>Débloqué : {badge.unlocked ? "Oui" : "Non"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GloryChest;
