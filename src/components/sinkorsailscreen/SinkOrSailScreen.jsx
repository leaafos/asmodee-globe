import React, { useEffect, useState } from "react";
import { ResponsiveRadar } from "@nivo/radar";
import "./sinkOrSailScreen.scss";

const RadarChart = ({ games, voteCounts, votes, handleVote, remainingVotes }) => {
  // Transformation des données pour le radar chart
  const radarData = games.map((game) => ({
    game: game.name.length > 15 ? game.name.substring(0, 15) + "..." : game.name,
    votes: voteCounts[game.id] || 0,
    fullName: game.name,
    gameId: game.id
  }));

  return (
    <div className="radar-container">
      {/* Radar Chart */}
      <div className="radar-chart">
        <ResponsiveRadar
          data={radarData}
          keys={['votes']}
          maxValue={Math.max(...Object.values(voteCounts), 10)}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          borderWidth={2}
          borderColor={{ from: 'color' }}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={36}
          dotSize={8}
          dotColor={{ theme: 'background' }}
          dotBorderWidth={2}
          dotBorderColor={{ from: 'color' }}
          colors={['#ffffff']}
          fillOpacity={0.2}
          blendMode="multiply"
          animate={true}
          isInteractive={true}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#ffffff',
                  fontSize: 12
                }
              }
            },
            grid: {
              line: {
                stroke: 'rgba(255, 255, 255, 0.35)',
                strokeWidth: 1
              }
            }
          }}
          legends={[]}
        />
      </div>
      
      {/* Game Cards positionnées autour du radar */}
      <div className="radar-game-cards">
        {games.map((game, index) => {
          // Calcul des positions autour du cercle
          const angle = (index * 360) / games.length - 90; // Commencer par le haut
          const radius = 45; // Distance du centre en pourcentage
          const x = 50 + (Math.cos(angle * Math.PI / 180) * radius);
          const y = 50 + (Math.sin(angle * Math.PI / 180) * radius);
          
          return (
            <div
              key={game.id}
              className="radar-game-card"
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
              }}
            >
              <div className={`vote-button ${votes[game.id] ? 'voted' : ''}`}
                  disabled={votes[game.id] || remainingVotes <= 0}
                  onClick={() => handleVote(game.id)}
                >
                <img
                  src={`http://localhost/uploads/${game.image}`}
                  alt={game.name}
                  className="game-image"
                />
                <h4 className="game-title">{game.name}</h4>
                <p className="game-category">{game.category || "Jeu de société"}</p>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SinkOrSailScreen = () => {
    const [games, setGames] = useState([]);
    const [votes, setVotes] = useState({});
    const [voteCounts, setVoteCounts] = useState({});
    const [message, setMessage] = useState("");

    const maxVotes = 5;
    const remainingVotes = maxVotes - Object.keys(votes).length;

    useEffect(() => {
        // Charger les jeux sélectionnés et les votes
        fetch("http://localhost/selected")
            .then((res) => res.json())
            .then(setGames)
            .catch((err) =>
                console.error("Erreur chargement jeux SinkOrSail :", err)
            );

        refreshVotes();
    }, []);

    const refreshVotes = () => {
        fetch("http://localhost/votes/counts")
            .then((res) => res.json())
            .then((data) => {
                const formatted = {};
                data.forEach((v) => {
                    formatted[v.game_id] = v.total_votes;
                });
                setVoteCounts(formatted);
            })
            .catch((err) =>
                console.error("Erreur chargement des votes :", err)
            );
    };

    const handleVote = async (gameId) => {
        if (votes[gameId] || remainingVotes <= 0) return;

        const payload = {
            game_id: gameId,
            vote: 1,
            time: new Date().toISOString(),
            season: 1,
        };

        try {
            const res = await fetch("http://localhost/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setVotes((prev) => ({ ...prev, [gameId]: true }));
                setMessage("Voted !");
                refreshVotes();
            } else {
                setMessage(data.error || "Erreur lors du vote.");
            }
        } catch (err) {
            console.error("Erreur requête vote :", err);
            setMessage("Erreur réseau.");
        }
    };

    return (
        <div id="sinkOrSailScreenContainer">
            <div className="header-section">
                <h2>SINK OR SAIL</h2>
                <p>Keep {remainingVotes}/5 games</p>
                {message && <p className="feedback">{message}</p>}
            </div>
            
            <div className="chart-section">
                {games.length > 0 && (
                    <RadarChart 
                        games={games} 
                        voteCounts={voteCounts}
                        votes={votes}
                        handleVote={handleVote}
                        remainingVotes={remainingVotes}
                    />
                )}
            </div>
        </div>
    );
};

export default SinkOrSailScreen;