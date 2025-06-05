import "./victoryScreen.scss"
import videoBg from "./../../assets/share_victory.mp4"
import victoryImage from "../../assets/victoryImage.svg"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VictoryScreen = () => {

    const [scores, setScores] = useState([]);
    const { gameId } = useParams();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContainer, setShowContainer] = useState(false); // Nouvel état pour l'animation
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

    // Fonction appelée quand la vidéo se termine
    const handleVideoEnd = () => {
        setShowContainer(true);
    };

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
            <video 
                autoPlay 
                muted 
                id="myVideo"
                onEnded={handleVideoEnd} // Événement de fin de vidéo
            >
                <source src={videoBg} type="video/mp4" />
            </video>
            <div id="innerVideoContainer" className={showContainer ? 'show' : ''}>
                <img src={victoryImage} id="victoryImage" />
                <div id="listScores">
                    {scores.length === 0 ? (
                        <p>Aucun score disponible pour le moment.</p>
                    ) : (
                        <div id="tableWrapper">
                            <div id="tableHeader">
                                <div className="col-rank header">RANK</div>
                                <div className="col-name header">NAME</div>
                                <div className="col-score header">SCORE</div>
                            </div>
                            {userScore && (
                                <div id="userRow">
                                    <div className="col-rank">{userScore.ranking}</div>
                                    <div className="col-name">{userScore.name}</div>
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
                    <button id="button" onClick={handlePlayAgain}>PLAY AGAIN</button>
                </div>
            </div>
        </div>
    )
}

export default VictoryScreen