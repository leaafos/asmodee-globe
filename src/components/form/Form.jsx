import { useState, useEffect } from "react";
import './form.scss';

const TeamBadgeForm = ({ onClose = () => {} }) => {
  const [teams, setTeams] = useState([]);
  const [badges, setBadges] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");

  // Pour modifier ou afficher la description et pays de l'équipe
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
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
    setCity("");
    setDescription("");
    return;
  }
  const team = teams.find((t) => t.id === parseInt(selectedTeam));
  if (team) {
    setCountry(team.country || "");
    setCity(team.city || "");
    setDescription(team.description || "");
  }
  console.log(teams)
}, [selectedTeam, teams]);

  // Fermer la popup avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
      setCity("");
      setDescription("");
      
      // Fermer la popup après 2 secondes
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Empêcher la fermeture en cliquant sur le contenu de la modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    console.log('Tentative de fermeture de la popup');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={handleModalClick}>
        <div className="modal-header">
          <h2 className="modal-title"> Assign a badge to a team</h2>
          <button
            className="close-button"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-content">
            <div className="form-group">
              <label className="form-label">
                Team<span className="required">*</span> :
              </label>
              <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              required
              className="form-select"
            >
              <option value="">-- Select a team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.country}{team.city ? `, ${team.city}` : ""})
                </option>
              ))}
            </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Badge<span className="required">*</span> :
              </label>
              <select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                required
                className="form-select"
              >
                <option value="">-- Select a badge --</option>
                {badges.map((badge) => (
                  <option key={badge.id} value={badge.id}>
                    {badge.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div className="form-group">
              <label className="form-label">
                Pays 
              </label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
      
                className="form-input"
              />
            </div> */}

            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
            
                rows={3}
                className="form-textarea"
              />
            </div>

            <div className="button-group">
              <button 
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
              >
                Assign the badge
              </button>
            </div>

            {message && (
              <div className="message success">
                {message}
              </div>
            )}
            {error && (
              <div className="message error">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamBadgeForm;