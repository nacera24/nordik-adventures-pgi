import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectAuth } from "../../store/authSlice";


import {
  fetchCommandesClient,
  selectCommandesClient,
  selectCommandesClientLoading,
  selectCommandesClientError,
} from "../../store/commandeClientSlice";


import "../../styles/CommandeClient.css";

function CommandeClient() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading: authLoading } = useSelector(selectAuth);
  const clientId = user?.id || null;
  const role = user?.role || null;

  const commandes = useSelector(selectCommandesClient);
  const loading = useSelector(selectCommandesClientLoading);
  const error = useSelector(selectCommandesClientError);


  const commandesArray = Array.isArray(commandes)
    ? commandes
    : (commandes?.results || []);

  useEffect(() => {
    if (!user || role !== "client") return;
    if (clientId) dispatch(fetchCommandesClient(clientId));
  }, [user, role, clientId, dispatch]);

  const handleVoirDetails = (commandeId) => {
    navigate(`/portail-client/commandes/${commandeId}`);
  };

  if (authLoading && !user) {
    return (
      <main className="commande-client-page">
        <h1>Mes commandes</h1>
        <p>Vérification de votre session...</p>
      </main>
    );
  }

  if (!user || role !== "client") {
    return (
      <main className="commande-client-page">
        <h1>Mes commandes</h1>
        <p>Vous devez être connecté en tant que client pour voir vos commandes.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="commande-client-page">
        <h1>Mes commandes</h1>
        <p>Chargement en cours...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="commande-client-page">
        <h1>Mes commandes</h1>
        <p className="error-message">{error}</p>
      </main>
    );
  }

  return (
    <main className="commande-client-page">
      <h1>Mes commandes</h1>

      {commandesArray.length === 0 ? (
        <p>Vous n&apos;avez aucune commande pour le moment.</p>
      ) : (
        <table className="commande-client-table">
          <thead>
            <tr>
              <th>N° commande</th>
              <th>Date</th>
              <th>Total TTC</th>
              <th>Statut paiement</th>
              <th>Statut commande</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {commandesArray.map((cmd) => {
              const dateObj = cmd.date_creation ? new Date(cmd.date_creation) : null;
              const dateStr = dateObj
                ? dateObj.toLocaleString("fr-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              const total = Number(cmd.montant_ttc ?? 0);

              //  statut paiement = facture.statut (PAYEE / EN_ATTENTE etc.)

              const statutPaiement = cmd.statut_paiement || "PAYEE";

              //  statut commande = cmd.statut (PREPARATION / EXPEDIEE / FERMEE)
              const statutCommande = cmd.statut || "—";

              return (
                <tr key={cmd.id}>
                  <td>{cmd.id}</td>
                  <td>{dateStr}</td>
                  <td>{total.toFixed(2)} $</td>
                  <td>{statutPaiement}</td>
                  <td>{statutCommande}</td>
                  <td>
                    <button
                      className="btn-details-commande"
                      onClick={() => handleVoirDetails(cmd.id)}
                    >
                      Voir le détail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default CommandeClient;
