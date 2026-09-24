import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfilClient, selectClientProfil } from "../../store/clientSlice";
import "../../styles/ProfilClient.css";

function ProfilClient() {
  const dispatch = useDispatch();
  const { data: profil, loading, error } = useSelector(selectClientProfil);

  useEffect(() => {
    dispatch(fetchProfilClient());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="client-profile">
        <p>Chargement du profil...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="client-profile">
        <p className="error-message">{error}</p>
        <button className="btn" onClick={() => dispatch(fetchProfilClient())}>
          Réessayer
        </button>
      </main>
    );
  }

  if (!profil) {
    return (
      <main className="client-profile">
        <p>Aucun profil trouvé.</p>
      </main>
    );
  }

  const { nom, username } = profil;

  return (
    <main className="client-profile">
      <h1>Mon profil</h1>

      <section className="profile-card">
        <div className="profile-row">
          <span className="label">Nom :</span>
          <span className="value">{nom || "-"}</span>
        </div>

        <div className="profile-row">
          <span className="label">E-mail :</span>
          <span className="value">{username || "-"}</span>
        </div>
      </section>
    </main>
  );
}

export default ProfilClient;
