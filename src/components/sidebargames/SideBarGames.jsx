import "./sideBarGames.scss";
import { useState, useEffect } from "react";
import arrow from "../../assets/arrow.svg";
import userIcon from "../../assets/user_icon.png"
import arrowDown from "../../assets/arrow_down_icon.png"
import favorite from "../../assets/favorite_icon.svg"
import favoriteCheck from "../../assets/favorite_check_icon.svg"
import settings from "../../assets/settings_icon.svg"
import myGames from "../../assets/my_games_icon.svg"
import searchIcon from "../../assets/search_icon.svg"
import avatar from "../../assets/avatar.png"
import { useNavigate, useParams } from "react-router-dom";

const SideBarGamesContainer = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [currentGame, setCurrentGame] = useState(null);
    const [expandedBar, setExpandedBar] = useState(false);
    const [expandedFavorites, setExpandedFavorites] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [userJob, setUserJob] = useState('');
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [onlinePlayers, setOnlinePlayers] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserName(user.name);
            setUserJob(user.jobTitle);
            setUserId(user.id);

            fetch(`http://localhost/liked/${user.id}`)
                .then(res => res.json())
                .then(setFavorites)
                .catch(err => console.error("Erreur favoris :", err));
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost/games")
            .then(res => res.json())
            .then(gamesData => {
                setGames(gamesData);
                // Si on est sur une page de jeu spécifique, trouve et affiche ce jeu
                if (gameId) {
                    const game = gamesData.find(g => g.id === parseInt(gameId));
                    setCurrentGame(game);
                }
            })
            .catch(err => console.error("Erreur fetch jeux :", err));
    }, [gameId]);

    // Afficher seulement le jeu actuel si on est sur une page de jeu
    const gamesToShow = gameId && currentGame ? [currentGame] : [];

    function handleClick() {
        setExpandedBar(!expandedBar);
    }

    function toggleFavorite(gameId) {
        if (!userId) return;

        const alreadyLiked = favorites.some(fav => fav.id === gameId);
        const url = `http://localhost/liked`;
        const options = {
            method: alreadyLiked ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, game_id: gameId })
        };

        fetch(url, options)
            .then(res => res.json())
            .then(updatedFavorites => {
                setFavorites(updatedFavorites);
            })
            .catch(err => {
                console.error("Erreur mise à jour favoris :", err);
            });
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    const handlePlayerClick = (playerId) => {
        // Logique pour gérer le clic sur un joueur
        console.log("Player clicked:", playerId);
    };

    return (
        <div id={expandedBar ? "sideBarGamesContainerNotExpanded" : "sideBarGamesContainer"}>
            <button id="toggleSideBar" onClick={handleClick}>
                <img src={arrow} alt="toggle sidebar" />
            </button>
            <div id={expandedBar ? "innerContainerNotExpanded" : "innerContainer"}>

                <div id="topIcons">
                    <button className="buttonTop"><img className="imgIcon" src={settings} alt="" /></button>
                    <button className="buttonTop"><img className="imgIcon" src={userIcon} alt="" /></button>
                    <button onClick={handleLogout} id="logOutButton">Log out</button>
                </div>
                <div id="userBlock">
                    <img id="avatar" src={avatar} alt="" />
                    <div id="userInfo">
                        <span id="jobTitle">{userJob || 'PRODUCT DESIGNER'}</span>
                        <span id="userName">{userName}</span>
                    </div>
                </div>

                {/* Afficher seulement si on est sur une page de jeu spécifique */}
                {gamesToShow.length > 0 && (
                    <div id="favoritesList">
                        <span id="favoritesTitle">IN GAME</span>
                        <ul id={expandedFavorites ? "noContainerFavoriteGames" : "containerFavoriteGames"}>
                            {gamesToShow.map(game => {
                                const isFavorite = favorites.some(fav => fav.id === game.id);
                                return (
                                    <li className="gameBlock" key={game.id}>
                                        {game.image && (
                                            <div className="leftBlock" style={{
                                                backgroundImage: `url(http://localhost/uploads/${game.image})`,
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat"
                                            }}></div>
                                        )}
                                        <div className="rightBlock">
                                            <div className="topBlock">
                                                <div className="titleAndCategories">
                                                    <span className="gameName">{game.name}</span>
                                                    <span className="categoryName">{game.category_name}</span>
                                                </div>
                                                <div className="usersInGame">
                                                    <div className="presence"></div>
                                                    <span>24</span>
                                                </div>
                                            </div>
                                            <div className="bottomBlock">
                                                <div className="leftButtons">
                                                    <button className="findMatch" onClick={() => handleGameClick(game.id)}>Find a match</button>
                                                    <button className="invite">Invite</button>
                                                </div>
                                                <button
                                                    className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                                                    onClick={() => toggleFavorite(game.id)}
                                                    aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                                                >
                                                    <img
                                                        src={isFavorite ? favoriteCheck : favorite}
                                                        alt={isFavorite ? "Favoris" : "Ajouter aux favoris"}
                                                        style={{ width: "16px", height: "16px" }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div id="nbPlayers">
                            <h1>Hello</h1>

                        </div>
                    </div>
                )}

                {/* Afficher les joueurs en ligne seulement si on est sur une page de jeu */}
                {gameId && (
                    <div id="gameList">
                        <span id="gamesMostPlayed">ONLINE PLAYERS</span>
                        <ul id={expandedFavorites ? "containerGamesExtended" : "containerGames"}>
                            {onlinePlayers.length > 0 ? (
                                onlinePlayers.map(player => (
                                    <li className="gameBlock" key={player.id || player.user_id}>
                                        <div className="leftBlock" style={{
                                            backgroundImage: `url(${player.avatar || avatar})`,
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat"
                                        }}></div>
                                        <div className="rightBlock">
                                            <div className="topBlock">
                                                <div className="titleAndCategories">
                                                    <span className="gameName">{player.name || player.username || `Player ${player.user_id}`}</span>
                                                    <span className="categoryName">Score: {player.score || 0}</span>
                                                </div>
                                                <div className="usersInGame">
                                                    <div className="presence"></div>
                                                    <span>Online</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="gameBlock">
                                    <span>
                                        No players currently online
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
};

export default SideBarGamesContainer;