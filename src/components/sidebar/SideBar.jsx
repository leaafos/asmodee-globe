import "./sideBar.scss"
import { useState, useEffect } from "react"
import arrow from "../../assets/arrow.svg"

const SideBar = () => {
  const [expandedBar, setExpandedBar] = useState(false);
  const [userName, setUserName] = useState('');
  const [games, setGames] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }

    
  }, []);

  useEffect(() => {
  fetch("http://localhost/games")
    .then(res => {
      if (!res.ok) throw new Error("HTTP error " + res.status);
      return res.json();
    })
    .then(data => {
      console.log("Données jeux reçues:", data);
      setGames(data);
    })
    .catch(err => {
      console.error("Erreur fetch jeux :", err);
    });
}, []);
  function handleClick() {
    setExpandedBar(!expandedBar);
  }

  return (
    <div id={expandedBar ? "sideBarContainerExpanded" : "sideBarContainer"}>
      <button id="toggleSideBar" onClick={handleClick}>
        <img src={arrow} alt="toggle sidebar" />
      </button>
      <div id={expandedBar ? "innerContainerExpanded" : "innerContainer"}>
        <div>
          <h3>Hello, {userName}</h3>
          {games.length > 0 && (
            <div className="gamesList">
              <h4>Jeux</h4>
              <ul>
                {games.map(game => (
                    <li key={game.id}>{game.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
