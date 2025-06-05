import "./sideBarSinkOrSail.scss"

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
import { cover } from "three/src/extras/TextureUtils.js";
import { useNavigate } from "react-router-dom";
import sinkIcon from "../../assets/sink_icon.svg"

const SideBarSinkOrSail = () => {
  const navigate = useNavigate();
  const [expandedBar, setExpandedBar] = useState(false);
  const [expandedFavorites, setExpandedFavorites] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [userJob, setUserJob] = useState('');
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showSinkOrSail, setShowSinkOrSail] = useState(false);

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
      .then(setGames)
      .catch(err => console.error("Erreur fetch jeux :", err));
  }, []);

  const availableGames = games.filter(game => 
    !favorites.some(fav => fav.id === game.id)
  );

  function handleClick() {
    setExpandedBar(!expandedBar);
  }

  function handleClick2() {
    setExpandedFavorites(!expandedFavorites)
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

  const handleSinkOrSailClick = () => {
    navigate('/sinkorsail');
  };

  return (
    <div id={expandedBar ? "sideBarSinkOrSailContainerNotExpanded" : "sideBarSinkOrSailContainer"}>
      <button id="toggleSideBar" onClick={handleClick}>
        <img src={arrow} alt="toggle sidebar" />
      </button>
      <div id={expandedBar ? "innerContainerNotExpanded" : "innerContainer"}>
        {/* Section fixe du haut */}
        <div className="fixed-top-section">
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
          <button onClick={handleSinkOrSailClick} id="sinkOrSail">
            <img src={sinkIcon} />
            Sink or sail
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="scrollable-content">
          {favorites.length > 0 && (
            <div id="favoritesList">
              <span id="favoritesTitle">FAVORITES</span>
              <button id="displayFavorites" onClick={handleClick2}>
                <div id="leftFavorites">
                  <img id="favoriteButtonImg" src={myGames} alt="" />
                  <span id="favoriteButtonText">My games</span>
                </div>
                <img id="arrow" src={arrowDown} alt="" />
              </button>
              <ul id={expandedFavorites ? "noContainerFavoriteGames" : "containerFavoriteGames"}>
                {favorites.map(game => {
                  const isFavorite = favorites.some(fav => fav.id === game.id);
                  return (
                    <li className="gameBlock" key={game.id}>
                      {game.image && (
                        <div className="leftBlock" style={{backgroundImage: `url(http://localhost/uploads/${game.image})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}></div>
                        
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
            </div>
          )}

          {games.length > 0 && (
            <div id="gameList">
              <span id="gamesMostPlayed">MOST PLAYED</span>
              <span id="gamesTitle">GAMES</span>
              <button id="searchGames">
                <div id="leftGamesButton">
                  <img id="gameButtonImg" src={searchIcon} alt="" />
                  <span id="gameButtonText">Search</span>
                </div>
              </button>
              <ul id={expandedFavorites ? "containerGamesExtended" : "containerGames"}>
                {availableGames.map(game => {
                  const isFavorite = favorites.some(fav => fav.id === game.id);
                  return (
                    <li className="gameBlock" key={game.id}>
                      {game.image && (
                        <div className="leftBlock" style={{backgroundImage: `url(http://localhost/uploads/${game.image})`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}></div>
                        
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
            </div>               
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBarSinkOrSail;