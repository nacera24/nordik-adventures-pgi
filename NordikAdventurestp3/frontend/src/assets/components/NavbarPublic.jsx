import { Link, useLocation } from "react-router-dom";
import '../../styles/Navbar.css';
import logo from "../images/logo.png";  

function NavbarPublic() {
  const location = useLocation();

  const icons = {
    home: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9.5l9-7 9 7V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    ),
    catalogue: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
      </svg>
    ),
    login: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 17l5-5-5-5v3H3v4h7v3zM19 19h-2v-4h2v4zm0-10h-2V5h2v4z" />
      </svg>
    ),
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Nordik Adventures" className="logo" />
        </Link>
      </div>

      <nav className="navbar-links">
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">{icons.home} Accueil</Link>
          </li>

          <li className={location.pathname === "/catalogue" ? "active" : ""}>
            <Link to="/catalogue">{icons.catalogue} Catalogue</Link>
          </li>

          <li className={location.pathname === "/login-client" ? "active" : ""}>
            <Link to="/connexion">{icons.login} Connexion</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavbarPublic;
