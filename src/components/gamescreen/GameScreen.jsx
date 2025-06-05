import "./gameScreen.scss"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import captainFlipBg from '../../assets/captainFlipBg.mp4'

const GameScreen = () => {

    const { gameId } = useParams();
    const navigate = useNavigate();
    const [currentGame, setCurrentGame] = useState(null);
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch("http://localhost/games")
            .then(res => res.json())
            .then(gamesData => {
                setGames(gamesData);
                if (gameId) {
                    const game = gamesData.find(g => g.id === parseInt(gameId));
                    setCurrentGame(game);
                }
            })
            .catch(err => console.error("Erreur fetch jeux :", err));
    }, [gameId]);

    const handleGameClick = () => {
        if (gameId) {
            navigate(`/victory/${gameId}`);
        } else {
            console.error("GameId is undefined");
        }
    };

    return (
        <div onClick={handleGameClick} id="gameScreenContainer">
            <video autoPlay muted id="bgVideo">
                <source src={captainFlipBg} type="video/mp4" />
            </video>
        </div>
    );
};

export default GameScreen;