import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import logo from "../images/logo.png";

function NavbarMagasinier() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const icons = {
    dashboard: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zM3 21h8v-6H3v6zm10-18v10h8V3h-8z" />
      </svg>
    ),
    products: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4v6l-9 4-9-4v-6z" />
      </svg>
    ),
    commandesAchat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v4H3V3zm0 6h18v12H3V9zm4 3h10v2H7v-2zm0 4h10v2H7v-2z" />
      </svg>
    ),
    commandesClients: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14h9.9c.8 0 1.5-.5 1.8-1.2l2-5.1c.3-.8-.3-1.7-1.2-1.7H6.4L5.7 3H2v2h2l3.1 9.3-.9 1.7c-.5 1 .2 2 1.3 2H19v-2H7.9l.3-.7z" />
      </svg>
    ),
    fournisseurs: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
      </svg>
    ),
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/portail-magasinier">
          <img src={logo} alt="Nordik Adventures" className="logo" />
        </Link>
      </div>

      <nav className="navbar-links">
        <ul>
          <li className={location.pathname === "/portail-magasinier" ? "active" : ""}>
            <Link to="/portail-magasinier">
              {icons.dashboard} Tableau de bord
            </Link>
          </li>

          <li className={location.pathname.includes("/portail-magasinier/produits") ? "active" : ""}>
            <Link to="/portail-magasinier/produits">
              {icons.products} Produits
            </Link>
          </li>

          <li className={location.pathname.includes("/portail-magasinier/commandes-achat") ? "active" : ""}>
            <Link to="/portail-magasinier/commandes-achat">
              {icons.commandesAchat} Commandes d’achat
            </Link>
          </li>

          <li className={location.pathname.includes("/portail-magasinier/commandes-clients") ? "active" : ""}>
            <Link to="/portail-magasinier/commandes-clients">
              {icons.commandesClients} Commandes clients
            </Link>
          </li>

          <li className={location.pathname.includes("/portail-magasinier/fournisseurs") ? "active" : ""}>
            <Link to="/portail-magasinier/fournisseurs">
              {icons.fournisseurs} Fournisseurs
            </Link>
          </li>
        </ul>
      </nav>

      <button className="logout-btn" onClick={logout}>
        Déconnexion
      </button>
    </header>
  );
}

export default NavbarMagasinier;
