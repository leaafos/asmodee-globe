import { ResponsiveRadar } from "@nivo/radar";

const RadarChart = ({ games, voteCounts }) => {
  // Transformation des données pour le radar chart
  const radarData = games.map((game) => ({
    game: game.name.length > 15 ? game.name.substring(0, 15) + "..." : game.name,
    votes: voteCounts[game.id] || 0,
    fullName: game.name,
    gameId: game.id
  }));

  return (
    <div style={{ height: "600px", width: "100%", position: "relative" }}>
      <ResponsiveRadar
        data={radarData}
        keys={['votes']}
        indexBy="game"
        maxValue={Math.max(...Object.values(voteCounts), 10)} // Max dynamique ou 10 minimum
        margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        dotSize={8}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        colors={['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308']}
        fillOpacity={0.1}
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
              stroke: '#6b46c1',
              strokeWidth: 1
            }
          }
        }}
        legends={[]}
      />
      
      {/* Game Cards positionnées autour du radar */}
      <div className="radar-game-cards">
        {games.map((game, index) => {
          // Calcul des positions autour du cercle
          const angle = (index * 360) / games.length - 90; // Commencer par le haut
          const radius = 40; // Distance du centre en pourcentage
          const x = 50 + (Math.cos(angle * Math.PI / 180) * radius);
          const y = 50 + (Math.sin(angle * Math.PI / 180) * radius);
          
          return (
            <div
              key={game.id}
              className="radar-game-card"
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                position: 'absolute',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="card-content">
                <img
                  src={`http://localhost/uploads/${game.image}`}
                  alt={game.name}
                  style={{ width: "60px", height: "60px", borderRadius: "8px" }}
                />
                <h4>{game.name.length > 12 ? game.name.substring(0, 12) + "..." : game.name}</h4>
                <div className="vote-count">
                  Votes: {voteCounts[game.id] || 0}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadarChart