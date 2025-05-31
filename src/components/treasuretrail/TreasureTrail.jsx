import { useState, useEffect } from "react";
import "./treasureTrail.scss";

const TreasureTrail = () => {
  const [scores, setScores] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);

      fetch(`http://localhost/scores/user/${user.id}/ranking`)
        .then((res) => {
          if (!res.ok) throw new Error("Erreur lors de la récupération des scores");
          return res.json();
        })
        .then((data) => {
          setScores(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError("Utilisateur non connecté");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div id="treasureContainer">Chargement des scores...</div>;
  }

  if (error) {
    return <div id="treasureContainer" style={{ color: "red" }}>Erreur : {error}</div>;
  }

  return (
    <div id="treasureContainer">
    <h2>Classement des scores</h2>
    {scores.length === 0 ? (
      <p>Aucun score disponible pour le moment.</p>
    ) : (
      <table className="scoresTable">
        <thead>
          <tr>
            <th>Nom</th><th>Score</th><th>Classement</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((scoreItem) => (
            <tr key={scoreItem.id}>
              <td>{scoreItem.name}</td><td>{scoreItem.score}</td><td>{scoreItem.ranking ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  );
};

export default TreasureTrail;
