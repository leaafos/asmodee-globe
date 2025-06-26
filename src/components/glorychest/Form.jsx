import { useState, useEffect } from "react";

const TeamBadgeForm = () => {
  const [teams, setTeams] = useState([]);
  const [badges, setBadges] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");

  // Pour afficher ou modifier la description et pays de l'équipe
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Charger les équipes et les badges au montage
  useEffect(() => {
    fetch("http://localhost/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch(() => setError("Erreur chargement équipes"));

    fetch("http://localhost/badges")
      .then((res) => res.json())
      .then((data) => setBadges(data))
      .catch(() => setError("Erreur chargement badges"));
  }, []);

  // Met à jour pays & description à partir de l'équipe sélectionnée
  useEffect(() => {
    if (!selectedTeam) {
      setCountry("");
      setDescription("");
      return;
    }
    const team = teams.find((t) => t.id === parseInt(selectedTeam));
    if (team) {
      setCountry(team.country || "");
      setDescription(team.description || "");
    }
  }, [selectedTeam, teams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedTeam || !selectedBadge) {
      setError("Veuillez sélectionner une équipe et un badge");
      return;
    }

    try {
      const response = await fetch("http://localhost/teamBadges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: selectedTeam,
          badge_id: selectedBadge,
          votes: 0,
          unlocked: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'envoi");
      }

      setMessage("Badge attribué avec succès !");
      setSelectedTeam("");
      setSelectedBadge("");
      setCountry("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Attribuer un badge à une équipe</h2>

      <label>
        Équipe* :
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          required
        >
          <option value="">-- Sélectionnez une équipe --</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name} ({team.country})
            </option>
          ))}
        </select>
      </label>

      <label>
        Badge* :
        <select
          value={selectedBadge}
          onChange={(e) => setSelectedBadge(e.target.value)}
          required
        >
          <option value="">-- Sélectionnez un badge --</option>
          {badges.map((badge) => (
            <option key={badge.id} value={badge.id}>
              {badge.name}
            </option>
          ))}
        </select>
      </label>


      <label>
        Description :
        <textarea value={description} disabled rows={3} required />
      </label>

      <button type="submit">Attribuer le badge</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default TeamBadgeForm;
