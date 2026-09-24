import "../styles/Accueil.css";
import heroImage from "../assets/images/Accueil.png"; 
import { useNavigate } from "react-router-dom";

function Accueil() {
  const navigate = useNavigate();

  return (
    <div 
      className="home-hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="home-overlay">
        <div className="home-content">

          <h1>Nordik Adventures</h1>

          <p>
            Portail unifié pour les clients et les employés : gestion des produits,
            du stock, des commandes, des factures et de la satisfaction client.
          </p>

          <div className="home-buttons">
  <button
    className="btn-client"
    onClick={() => navigate("/connexion")}
  >
    Je suis client
  </button>

  <button
    className="btn-employe"
    onClick={() => navigate("/connexion")}
  >
    Je suis employé
  </button>
</div>


        </div>
      </div>
    </div>
  );
}

export default Accueil;
