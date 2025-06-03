import React, { useEffect, useState } from "react";
import "./gloryChest.scss";
import TeamBadgeForm from "./Form";
import piratsCouncil from "../../assets/piratsCouncil.png"
import gloryChest from "../../assets/gloryChest.png"
import Background from "three/src/renderers/common/Background.js";
import { color } from "three/tsl";


const GloryChest = () => {
  const [teamId, setTeamId] = useState(null);
  const [user, setUser] = useState(null); // Ajouté
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [pendingBadges, setPendingBadges] = useState([]);
  const [othersPendingBadges, setOthersPendingBadges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [voteMessage, setVoteMessage] = useState(null);
  const [voteError, setVoteError] = useState(null);
  const [gloryChestContent, setGloryChestContent] = useState('glory')

  const TabButton = ({ isActive, onClick, children, backgroundImage }) => (
    <button
      onClick={onClick}
      className={`button ${isActive ? 'activeButton' : ''}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {children}
    </button>
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Stocker l'utilisateur
      setTeamId(parsedUser.teamId || parsedUser.team_id);
    }
  }, []);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamBadges = async () => {
      try {
        const resUnlocked = await fetch(`http://localhost/teamBadges/unlocked/${teamId}`);
        if (!resUnlocked.ok) throw new Error("Erreur lors de la récupération des badges débloqués");
        const unlockedData = await resUnlocked.json();
        setUnlockedBadges(unlockedData);

        const resPending = await fetch(`http://localhost/teamBadges/pending/${teamId}`);
        if (!resPending.ok) throw new Error("Erreur lors de la récupération des badges en cours");
        const pendingData = await resPending.json();
        setPendingBadges(pendingData);

        const resOthers = await fetch(`http://localhost/teamBadges/pendingOthers/${teamId}`);
        if (!resOthers.ok) throw new Error("Erreur lors de la récupération des badges des autres équipes");
        const othersData = await resOthers.json();
        setOthersPendingBadges(othersData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeamBadges();
  }, [teamId]);

  const handleVote = async (teamBadgeId) => {
    setVoteMessage(null);
    setVoteError(null);

    if (!user) {
      setVoteError("Utilisateur non authentifié.");
      return;
    }

    try {
      const res = await fetch(`http://localhost/teamBadges/${teamBadgeId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur lors du vote");
      }

      setVoteMessage("Vote enregistré !");

      const resPending = await fetch(`http://localhost/teamBadges/pendingOthers/exclude/${teamId}`);
      const othersData = await resPending.json();
      setOthersPendingBadges(othersData);

      const resTeamPending = await fetch(`http://localhost/teamBadges/pendingOthers/${teamId}`);
      const teamPendingData = await resTeamPending.json();
      setPendingBadges(teamPendingData);
    } catch (err) {
      setVoteError(err.message);
    }
  };

  return (
    <div id="gloryContainer">
      <div id="buttonsTop">
        <TabButton
          isActive={gloryChestContent === 'glory'}
          onClick={() => setGloryChestContent('glory')}
          backgroundImage={gloryChest}
        >
          THE GLORY CHEST
        </TabButton>
        <TabButton
          isActive={gloryChestContent === 'council'}
          onClick={() => setGloryChestContent('council')}
          backgroundImage={piratsCouncil}
        >
          THE PIRAT'S COUNCIL
        </TabButton>
      </div>
      <div id="mainContent">
        {gloryChestContent === 'glory' ? (
          <div id="gloryChestContent">

            {unlockedBadges.length === 0 ? (
              <p style={{ color: "white" }}>Aucun badge débloqué.</p>
            ) : (
              unlockedBadges.map((badge) => (
                <div key={badge.id} className="badge-card">
                  <img
                    src={`http://localhost/uploads/${badge.image}`}
                    alt={badge.badge_name}
                    className="imgBadge"
                  />
                  <span className="badgeName">{badge.badge_name}</span>
                  <p>{badge.description}</p>

                </div>
              ))
            )}

            {pendingBadges.length === 0 ? (
              <p style={{ color: 'white' }}>Aucun badge en cours de vote.</p>
            ) : (
              pendingBadges.map((badge) => (
                <div key={badge.id} className="badge-card">

                  <img
                    src={`http://localhost/uploads/${badge.image}`}
                    alt={badge.badge_name}
                    className="imgBadge"
                  />
                  <span className="badgeName">{badge.badge_name}</span>
                  <p>{badge.description}</p>
                </div>
              ))
            )}

            <div className="badge-card">
              <button id="buttonBadge" onClick={() => setShowForm(true)}>Soumettre un badge</button>
              {showForm && <TeamBadgeForm />}

            </div>





          </div>
        ) : (
          <div id="piratCouncilContent">
            {voteMessage && <p style={{ color: "green" }}>{voteMessage}</p>}
            {voteError && <p style={{ color: "red" }}>{voteError}</p>}
            {othersPendingBadges.length === 0 ? (
              <p style={{ color: 'white' }}>Aucun badge à voter pour les autres équipes.</p>
            ) : (
              othersPendingBadges.map((badge) => (
                <div key={badge.id} className="innerContainer">
                  <div className="leftContainer">
                    <img
                      src={`http://localhost/uploads/${badge.image}`}
                      alt={badge.badge_name}

                    />
                    <button id="voteButton" onClick={() => handleVote(badge.id)}>Voter</button>
                  </div>
                  <div className="rightBlock">
                    <div className="topRightBlock">
                      <div className="badgeInfos">
                        <span className="badgeName">{badge.badge_name}</span>
                        <span className="teamName">{badge.team_name}</span>
                      </div>
                      <div className="voteBar">
                        <div className="vote-progress-container">
                          <div
                            className="vote-progress-bar"
                            style={{
                              width: `${Math.min((badge.votes / badge.vote_threshold) * 100, 100)}%`
                            }}
                          >
                            <span className="vote-percentage">
                              {Math.round((badge.votes / badge.vote_threshold) * 100)}%
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="bottomRightBlock">
                      <p className="description">{badge.description}</p>

                    </div>


                  </div>
                </div>

              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GloryChest;







