import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import logo from "../images/logo.png";

function NavbarFinancier() {
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
    panier: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 4h-2l-3 7v2h2l2.6 7h11.8l2.6-7h2v-2l-3-7h-2l-2 4h-7l-2-4zm3.3 6h5.4l1.4-3h-8.2l1.4 3zm-1.3 2l-1.9 5h9.8l-1.9-5h-6z" />
      </svg>
    ),
    factures: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2h9l5 5v15H6V2zm9 7h5l-5-5v5zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h5v2H8V9z" />
      </svg>
    ),
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/portail-financier">
          <img src={logo} alt="Nordik Adventures" className="logo" />
        </Link>
      </div>

      <nav className="navbar-links">
        <ul>
          <li className={location.pathname === "/portail-financier" ? "active" : ""}>
            <Link to="/portail-financier">
              {icons.dashboard} Tableau de bord
            </Link>
          </li>

          <li
            className={
              location.pathname.includes("/portail-financier/panier") ? "active" : ""
            }
          >
            <Link to="/portail-financier/panier">
              {icons.panier} Panier d’achats
            </Link>
          </li>

          <li
            className={
              location.pathname.includes("/portail-financier/factures") ? "active" : ""
            }
          >
            <Link to="/portail-financier/factures">
              {icons.factures} Factures
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

export default NavbarFinancier;
