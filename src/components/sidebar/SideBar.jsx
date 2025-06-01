import "./sideBar.scss";
import { useState, useEffect } from "react";
import arrow from "../../assets/arrow.svg";
import SinkOrSail from "../sidebar/SinkOrSail"; 


const SideBar = () => {
  const [expandedBar, setExpandedBar] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showSinkOrSail, setShowSinkOrSail] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
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

  return (
    <div id={expandedBar ? "sideBarContainerExpanded" : "sideBarContainer"}>
      <button id="toggleSideBar" onClick={handleClick}>
        <img src={arrow} alt="toggle sidebar" />
      </button>
      <div id={expandedBar ? "innerContainerExpanded" : "innerContainer"}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
          <button onClick={handleLogout} >
            Logout
          </button>
        </div>
        <div style={{ padding: "10px", textAlign: "center" }}>
          <button onClick={() => setShowSinkOrSail(true)}>Sink or Sail</button>
        </div>
        {showSinkOrSail && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowSinkOrSail(false)}>X</button>
              <SinkOrSail />
            </div>
          </div>
        )}
        <div>
          <h3>Hello, {userName}</h3>

          {favorites.length > 0 && (
            <div className="favoritesList">
              <h4>Mes jeux</h4>
              <ul>
                {favorites.map(game => {
                  const isFavorite = favorites.some(fav => fav.id === game.id);
                  return (
                    <li key={game.id}>
                      {game.image && (
                        <img
                          src={`http://localhost/uploads/${game.image}`}
                          alt={game.name}
                          style={{ width: "80px", height: "auto", marginBottom: "8px" }}
                        />
                      )}
                      <strong>{game.name}</strong><br />
                      <small>Catégorie : {game.category_name}</small><br />
                      <button
                        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                        onClick={() => toggleFavorite(game.id)}
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        {isFavorite ? '❤️' : '🤍'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {games.length > 0 && (
            <div className="gamesList">
              <h4>Jeux</h4>
              <ul>
                {games.map(game => {
                  const isFavorite = favorites.some(fav => fav.id === game.id);
                  return (
                    <li key={game.id}>
                      {game.image && (
                        <img
                          src={`http://localhost/uploads/${game.image}`}
                          alt={game.name}
                          style={{ width: "80px", height: "auto", marginBottom: "8px" }}
                        />
                      )}
                      <strong>{game.name}</strong><br />
                      <small>Catégorie : {game.category_name}</small><br />
                      <button 
                        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`} 
                        onClick={() => toggleFavorite(game.id)} 
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        {isFavorite ? '❤️' : '🤍'}
                      </button>
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

export default SideBar;
