
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import logo from "../images/logo.png";

function NavbarClient() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const icons = {
    home: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3l10 9h-3v9h-6v-6H11v6H5v-9H2l10-9z" />
      </svg>
    ),
    orders: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 5h18v2H3V5zm2 4h14v2H5V9zm0 4h10v2H5v-2zm0 4h8v2H5v-2z" />
      </svg>
    ),
    profile: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
      </svg>
    ),
    cart: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 4h-2l-1 2h2l3.6 7.6-1.35 2.4c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h10v-2h-9.42c-.14 0-.25-.11-.25-.25l.03-.12L15.1 13h5.4l1.5-7H7z" />
      </svg>
    ),
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/portail-client">
          <img src={logo} alt="Nordik Adventures" className="logo" />
        </Link>
      </div>

      <nav className="navbar-links">
        <ul>
          <li
            className={
              location.pathname === "/portail-client" ? "active" : ""
            }
          >
            <Link to="/portail-client">
              {icons.home} Accueil
            </Link>
          </li>
          
          <li
            className={
               location.pathname.startsWith("/portail-client/produits")
                  ? "active"
                  : ""
                    }
                    >
             <Link to="/portail-client/produits">
             {icons.cart } Produit
             </Link>
          </li>

          <li
            className={
              location.pathname.includes("/portail-client/commandes")
                ? "active"
                : ""
            }
          >
            <Link to="/portail-client/commandes">
              {icons.orders} Mes commandes
            </Link>
          </li>

          <li
            className={
              location.pathname.includes("/portail-client/panier")
                ? "active"
                : ""
            }
          >
            <Link to="/portail-client/panier">
              {icons.cart} Mon panier
            </Link>
          </li>

          <li
            className={
              location.pathname.includes("/portail-client/profil")
                ? "active"
                : ""
            }
          >
            <Link to="/portail-client/profil">
              {icons.profile} Mon profil
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

export default NavbarClient;
