import "./victoryScreen.scss"
import videoBg from "./../../assets/videoBg.mp4"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VictoryScreen = () => {

    const [scores, setScores] = useState([]);
    const { gameId } = useParams();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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


    const handlePlayAgain = () => {
        if (gameId) {
            navigate(`/game/${gameId}`);
        }
    };

    return (
        <div id="victoryScreenContainer">
            <video autoPlay loop muted id="myVideo">
                <source src={videoBg} type="video/mp4" />
            </video>
            <div id="innerVideoContainer">
                <div id="listScores">
                    {scores.length === 0 ? (
                        <p>Aucun score disponible pour le moment.</p>
                    ) : (
                        <div id="tableWrapper">
                            <div id="tableHeader">
                                <div className="col-rank">RANK</div>
                                <div className="col-name">NAME</div>
                                <div className="col-score">SCORE</div>
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
                <div id="score">
                    <span id="text">+32 POINTS</span>

                </div>
                <div id="playAgainButton">
                    <button id="button" onClick={handlePlayAgain} >PLAY AGAIN</button>
                    
                </div>
            
                

        
                
                

            </div>
        </div>
    )
}

export default VictoryScreen