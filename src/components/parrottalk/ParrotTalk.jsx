import { useState, useEffect } from "react";
import "./parrotTalk.scss";

const ParrotTalk = () => {
  // Récupère l'utilisateur connecté depuis localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user?.role; // 'A' ou 'B'
  const userId = user?.id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Charger messages + réactions associées
  useEffect(() => {
    fetch("http://localhost/messagesPT")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des messages");
        return res.json();
      })
      .then((data) => {
        // on s’attend à ce que chaque message ait un tableau "reactions"
        // sinon, on initialise à []
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
      // ajouter message avec réactions vides
      setMessages((prev) => [...prev, { ...newMessage, reactions: [] }]);
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle réaction coeur pour un message donné
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

      // Mise à jour locale des réactions dans le message
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === messageId) {
            const existing = msg.reactions.find(
              (r) => r.user_id === userId && r.reaction === reactionType
            );
            let newReactions;
            if (existing) {
              // Retirer la réaction (toggle off)
              newReactions = msg.reactions.filter(
                (r) => !(r.user_id === userId && r.reaction === reactionType)
              );
            } else {
              // Ajouter la réaction (toggle on)
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

  // Fonction utilitaire pour compter le nombre de réactions d’un type sur un message
  const countReactions = (msg, reactionType) =>
    msg.reactions.filter((r) => r.reaction === reactionType).length;

  // Vérifie si l’utilisateur connecté a déjà mis ce type de réaction
  const userHasReacted = (msg, reactionType) =>
    msg.reactions.some((r) => r.user_id === userId && r.reaction === reactionType);

  return (
    <div id="parrotContainer">
      <h3>Parrot Talk</h3>

      {userRole === "A" && (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Écris ton message ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Envoyer</button>
        </form>
      )}

      {error && <p className="error">{error}</p>}

      <div id="messagesList">
        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="messageItem">
              <p>
                <strong>{msg.name}</strong> - {msg.structure} - {msg.country}
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
      </div>
    </div>
  );
};

export default ParrotTalk;
