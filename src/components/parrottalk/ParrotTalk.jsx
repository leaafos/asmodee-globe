import { useState, useEffect, useRef } from "react";
import "./parrotTalk.scss";
import deleteIcon from "../../assets/deleteIcon.svg"
import modifyIcon from "../../assets/modifyIcon.svg"
import heart from "../../assets/heart.svg"
import fire from "../../assets/fire.svg"
import more from "../../assets/more.svg"
import arrow from "../../assets/arrow.svg"
import { color } from "three/tsl";

const ParrotTalk = () => {
  // Utilisation des données depuis localStorage comme dans votre code original
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user?.role;
  const userId = user?.id;
  const messageListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    fetch("http://localhost/messagesPT")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des messages");
        return res.json();
      })
      .then((data) => {
        const withReactions = data.map((msg) => ({
          ...msg,
          reactions: msg.reactions || [],
        }));
        setMessages(withReactions);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await fetch("http://localhost/messagesPT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi du message");

      const newMessage = await res.json();
      setMessages((prev) => [...prev, { ...newMessage, reactions: [] }]);
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  async function toggleReaction(messageId, reactionType) {
    try {
      const res = await fetch("http://localhost/reactions/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          reaction: reactionType,
          messagePT_id: messageId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erreur toggle réaction, serveur dit :", errorText);
        throw new Error("Erreur lors du toggle réaction");
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === messageId) {
            const existing = msg.reactions.find(
              (r) => r.user_id === userId && r.reaction === reactionType
            );
            let newReactions;
            if (existing) {
              newReactions = msg.reactions.filter(
                (r) => !(r.user_id === userId && r.reaction === reactionType)
              );
            } else {
              newReactions = [...msg.reactions, { user_id: userId, reaction: reactionType }];
            }
            return { ...msg, reactions: newReactions };
          }
          return msg;
        })
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  const countReactions = (msg, reactionType) =>
    msg.reactions.filter((r) => r.reaction === reactionType).length;

  const userHasReacted = (msg, reactionType) =>
    msg.reactions.some((r) => r.user_id === userId && r.reaction === reactionType);

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop += 1; 
      }
    }, 150); 
  
    return () => clearInterval(interval); 
  }, []);
  

  return (
    <div className="parrot-wrapper">
      <div id="parrotContainer">
        <span id="titleParrot">THE PARROT TALK</span>
        <div id="messageList" ref={messageListRef}>
          {messages.length === 0 ? (
            <p style={{color: "white"}} className="no-messages">Aucun message pour le moment.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="messageItem">
                <div className="message-header">
                  <div className="topPart">
                    <span className="user-name">{msg.senderName}</span>
                    {currentUser && currentUser.name === msg.senderName && (
                      <div className="message-actions">
                        <button className="action-btn edit-btn">
                          <img className="actionIcon" src={modifyIcon} alt="Edit" />
                        </button>
                        <button className="action-btn delete-btn">
                          <img className="actionIcon" src={deleteIcon} alt="Delete" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="user-details">
                    {msg.structure} • {msg.country}
                  </p>
                </div>
                {/* Message Content */}
                <p className="message-content">{msg.message}</p>

                {/* Reactions */}
                <div className="reactions-container">
                  <button className="reaction-btn">
                    <img src={more} />
                  </button>
                  

                  <button
                    className={`reaction-btn ${userHasReacted(msg, "fire") ? "active" : ""}`}
                    onClick={() => toggleReaction(msg.id, "fire")}
                    aria-label="Réaction fire"
                  >
                    <span className="count">{countReactions(msg, "fire")}</span>
                    <img src={fire} />
                  </button>
                  
                  <button
                    className={`reaction-btn ${userHasReacted(msg, "heart") ? "active" : ""}`}
                    onClick={() => toggleReaction(msg.id, "heart")}
                    aria-label="Réaction cœur"
                  >
                    
                    <span className="count">{countReactions(msg, "heart")}</span>
                    <img src={heart} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        {userRole === "A" && (
          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Send a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onClick={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                className="message-input"
              />
              <button
                onClick={handleSubmit}
                className="send-btn"
                disabled={!message.trim()}
              >
                <img src={arrow} id="arrowSendMsg" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParrotTalk;