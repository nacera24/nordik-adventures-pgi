
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  loginUser,
  clearAuthState,
  selectAuth,
} from "../store/authSlice";
import "../styles/Connexion.css";

function Connexion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registered } = useSelector(selectAuth);

  // rôle sélectionné dans le formulaire : "client" ou "employe"
  const [role, setRole] = useState("client");
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    nom: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const resetForm = () =>
    setFormData({
      nom: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

  useEffect(() => {
    return () => dispatch(clearAuthState());
  }, [dispatch]);

  // Si inscription client réussie
  useEffect(() => {
    if (registered) {
      alert("Inscription réussie ! Vous pouvez vous connecter.");
      setIsLogin(true);
      resetForm();
      dispatch(clearAuthState());
    }
  }, [registered, dispatch]);

  // Quand on passe sur le rôle "employé" on force le mode connexion
  useEffect(() => {
    if (role === "employe") {
      setIsLogin(true);
      resetForm();
      dispatch(clearAuthState());
    }
  }, [role, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // fonction de redirection selon rôle
  const redirectByRole = (backendRole) => {
    switch (backendRole) {
      case "client":
        navigate("/portail-client", { replace: true });
        break;

      case "magasinier":
        navigate("/portail-magasinier", { replace: true });
        break;

      case "financier":
      case "comptable":
        navigate("/portail-financier", { replace: true });
        break;

      case "agentclientele":
        navigate("/portail-service-client", { replace: true });
        break;

      default:
        alert(
          `Rôle non configuré côté frontend (${backendRole}). Vérifie la valeur dans la base de données.`
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.username.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // =========================
    //  CONNEXION (client / employé)
    // =========================
    if (isLogin) {
      if (!email || !formData.password) {
        alert("Email et mot de passe sont obligatoires.");
        return;
      }

      if (!emailRegex.test(email)) {
        alert("Veuillez saisir une adresse e-mail valide.");
        return;
      }

      try {
        const data = await dispatch(
          loginUser({
            username: email,
            password: formData.password,
            type: role, // "client" ou "employe"
          })
        ).unwrap();

        const user = data?.user ?? data;


        localStorage.setItem("nom", user?.nom || "");

        // username -> email 
        localStorage.setItem("username", user?.username || user?.courriel || email);

        // role -> pour redirection + autorisation
        const backendRole = user?.role;
        if (!backendRole) {
          alert("Le rôle n’a pas été renvoyé par le serveur.");
          return;
        }
        localStorage.setItem("role", backendRole);

      
        if (data?.token) localStorage.setItem("token", data.token);

        // redirection
        redirectByRole(backendRole);
      } catch (err) {
        console.error("Erreur de connexion:", err);
      }

      return;
    }

    // =========================
    //  INSCRIPTION (CLIENT uniquement)
    // =========================
    if (role !== "client") {
      alert("L'inscription est réservée aux clients.");
      return;
    }

    if (!formData.nom.trim()) {
      alert("Le nom est obligatoire.");
      return;
    }

    if (!email || !formData.password) {
      alert("Email et mot de passe sont obligatoires.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    //  inscription client
    dispatch(
      registerUser({
        username: email,
        password: formData.password,
        nom: formData.nom.trim(),
      })
    );
  };

  const isRegisterInvalid =
    role === "client" &&
    !isLogin &&
    (!formData.nom.trim() ||
      !formData.username.trim() ||
      !formData.password ||
      formData.password.length < 6 ||
      formData.password !== formData.confirmPassword);

  return (
    <div className="connexion-container">
      <div className="connexion-box">
        {/* Onglets rôle */}
        <div className="role-toggle">
          <button
            type="button"
            className={role === "client" ? "role-btn active" : "role-btn"}
            onClick={() => setRole("client")}
          >
            Espace client
          </button>

          <button
            type="button"
            className={role === "employe" ? "role-btn active" : "role-btn"}
            onClick={() => setRole("employe")}
          >
            Espace employé
          </button>
        </div>

        <h2>
          {role === "client"
            ? isLogin
              ? "Connexion client"
              : "Inscription client"
            : "Connexion employé"}
        </h2>

        <form
          key={isLogin ? `login-${role}` : `register-${role}`}
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          {/* Nom uniquement pour inscription client */}
          {role === "client" && !isLogin && (
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                id="nom"
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Votre nom"
                autoComplete="off"
                spellCheck="false"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Adresse e-mail</label>
            <input
              id="username"
              type="email"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={
                role === "client"
                  ? "ex: client@nordik.com"
                  : "ex: employe@nordik.com"
              }
              autoComplete="off"
              spellCheck="false"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete={isLogin ? "current-password" : "new-password"}
              spellCheck="false"
              required
            />
          </div>

          {/* Confirmation uniquement pour inscription client */}
          {role === "client" && !isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                spellCheck="false"
                required
              />
            </div>
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="connexion-btn"
            disabled={loading || isRegisterInvalid}
          >
            {loading
              ? "Veuillez patienter..."
              : isLogin
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </form>

        {/* Bascule login/register seulement pour client */}
        {role === "client" && (
          <p className="toggle-text">
            {isLogin ? "Pas de compte ?" : "Déjà inscrit ?"}{" "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
                dispatch(clearAuthState());
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsLogin(!isLogin);
                  resetForm();
                  dispatch(clearAuthState());
                }
              }}
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </span>
          </p>
        )}

        {/* Info employé */}
        {role === "employe" && (
          <p className="toggle-text info-employe">
            Les comptes employés sont déjà créés dans la base de données. Veuillez
            utiliser votre courriel et mot de passe.
          </p>
        )}
      </div>
    </div>
  );
}

export default Connexion;
