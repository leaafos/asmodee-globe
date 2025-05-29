import { useState, useEffect } from "react";
import "./parrotTalk.scss";

const ParrotTalk = () => {
  // Récupère l'utilisateur connecté depuis localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user?.role;  // 'A' ou 'B'
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
      .then((data) => setMessages(data))
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
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

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
          messages.map((msg, index) => (
            <div key={index} className="messageItem">
               <p><strong>{msg.name}</strong> - {msg.structure} - {msg.country}</p>
               <p>{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParrotTalk;
