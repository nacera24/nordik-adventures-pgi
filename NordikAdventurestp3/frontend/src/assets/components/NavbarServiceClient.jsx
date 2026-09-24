import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import logo from "../images/logo.png";

function NavbarServiceClient() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/portail-service-client">
          <img src={logo} alt="Nordik Adventures" className="logo" />
        </Link>
      </div>

      {/* Liens */}
      <nav className="navbar-links">
        <ul>
          <li
            className={
              location.pathname === "/portail-service-client" ? "active" : ""
            }
          >
            <Link to="/portail-service-client">
              Tableau de bord CRM
            </Link>
          </li>
        </ul>
      </nav>

      {/* Déconnexion */}
      <button className="logout-btn" onClick={logout}>
        Déconnexion
      </button>
    </header>
  );
}

export default NavbarServiceClient;
