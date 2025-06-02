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

  const userScore = scores.find(score => score.id === userId);
  const otherScores = scores.filter(score => score.id !== userId);

  if (loading) {
    return <div id="treasureContainer">Chargement des scores...</div>;
  }

  if (error) {
    return <div id="treasureContainer" className="error">Erreur : {error}</div>;
  }

  return (
    <div id="treasureContainer">
      <div id="titleContainer">
        <span id="titleText">TREASURE TRAIL</span>
      </div>
      
      <div id="listScores">
        {scores.length === 0 ? (
          <p>Aucun score disponible pour le moment.</p>
        ) : (
          <div id="tableWrapper">
            <div id="tableHeader">
              <div className="col-rank">Rank</div>
              <div className="col-name">Name</div>
              <div className="col-score">Score</div>
            </div>
            {userScore && (
              <div id="userRow">
                <div className="col-rank">{userScore.ranking}</div>
                <div className="col-name">{userScore.name} ✨</div>
                <div className="col-score">{userScore.score}</div>
              </div>
            )}
            <div id="scrollableContent">
              {otherScores.map((scoreItem) => (
                <div key={scoreItem.id} className="table-row">
                  <div className="col-rank">{scoreItem.ranking ?? "-"}</div>
                  <div className="col-name">{scoreItem.name}</div>
                  <div className="col-score">{scoreItem.score}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasureTrail;