import React from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";  
import "../../styles/PortailClient.css";

function PortailClient() {
  const { user } = useSelector(selectAuth);

  const username = user?.nom || user?.username || "client";

  return (
    <main className="client-home">
      <h1>
        Bienvenue, <span className="highlight">{username}</span> 👋
      </h1>
      <p>Heureux de vous revoir sur votre espace client Nordik Adventures.</p>
    </main>
  );
}

export default PortailClient;
