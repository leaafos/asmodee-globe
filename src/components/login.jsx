import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur inconnue');
        return;
      }
      setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Utilisateur connecté:', data.user);
       navigate('/');
    } catch (err) {
      setError('Erreur réseau');
        console.error(err);
    }
  };


  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Prénom"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit">Se connecter</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}

export default Login;