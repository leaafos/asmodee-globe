import { useState, useEffect } from "react";
import "./parrotTalk.scss";

const ParrotTalk = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user?.role; // 'A' ou 'B'
  const userId = user?.id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    e.preventDefault();
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

  return (
    <div id="parrotContainer">
      <span id="titleParrot">THE PARROT TALK</span>
      <div id="messagesList">
        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="messageItem">
              <p>
                {msg.name} - {msg.structure} - {msg.country}
              </p>
              <p>{msg.message}</p>

              <button
                className={`reactionBtn ${userHasReacted(msg, "heart") ? "active" : ""}`}
                onClick={() => toggleReaction(msg.id, "heart")}
                aria-label="Réaction cœur"
                type="button"
              >
                ❤️ {countReactions(msg, "heart")}
              </button>
            </div>
          ))
        )}
        {userRole === "A" && (
        <form className="formMessage" onSubmit={handleSubmit}>
          <input
            id="inputMessage"
            placeholder="Écris ton message ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{background: 'none', border: '1px solid white'}}
          />
          <button type="submit">Envoyer</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ParrotTalk;
