import { useState, useEffect, useRef } from "react";
import "./treasureTrail.scss";

const TreasureTrail = () => {
  const [scores, setScores] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRowRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(Number(user.id));

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
  const sortedScores = [...scores].sort((a, b) => {
    if (a.id === userId) return -1;
    if (b.id === userId) return 1;
    return (a.ranking ?? Infinity) - (b.ranking ?? Infinity);
  });
  

  const scrollToUser = () => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      userRowRef.current.classList.add("highlight");
      setTimeout(() => {
        userRowRef.current.classList.remove("highlight");
      }, 1500);
    }
  };

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
      <div>

            {/* {userScore ? (
              <div
                id="userRowTop"
                onClick={scrollToUser}
                style={{ cursor: "pointer" }}
              >
                <div className="col-rank">{userScore?.ranking}</div>
                <div className="col-name">{userScore?.name}</div>
                <div className="col-score">{userScore?.score}</div>
              </div>
            ) : null} */}
            </div>

      <div id="listScores">
        <div id="tableWrapper">
          <div id="tableHeader">
            <div className="col-rank header">RANK</div>
            <div className="col-name header">NAME</div>
            <div className="col-score header">SCORE</div>
          </div>
    

          <div id="scrollableContent">
              {sortedScores.map((scoreItem) => {
                const isUser = scoreItem.name === "Me";
                  return (
                    <div>
                    <div
                      key={scoreItem.id}
                      ref={isUser ? userRowRef : null}
                      className={`table-row ${isUser ? "me" : ""}`}
                    >
                       <div className="col-rank">{scoreItem.ranking ?? "-"}</div>
                        <div className="col-name">{isUser ? "Me" : scoreItem.name}</div>
                        <div className="col-score">{scoreItem.score}</div>

                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasureTrail;
