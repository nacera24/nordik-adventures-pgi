import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchCommandeClientDetail,
  selectCommandeClientCourante,
  selectCommandeClientLoading,
  selectCommandeClientError,
} from "../../store/commandeClientSlice";

import "../../styles/FactureClient.css"; 

function DetailCommandeClient() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); //

  const commande = useSelector(selectCommandeClientCourante);
  const loading = useSelector(selectCommandeClientLoading);
  const error = useSelector(selectCommandeClientError);

  useEffect(() => {
    if (!id) return;

    if (!commande || String(commande.id) !== String(id)) {
      dispatch(fetchCommandeClientDetail(id));
    }
  }, [id, commande, dispatch]);

  if (loading) {
    return (
      <main className="facture-page">
        <p>Chargement de la commande...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="facture-page">
        <p className="error-message">{error}</p>
      </main>
    );
  }

  if (!commande) {
    return (
      <main className="facture-page">
        <h1>Détail de la commande</h1>
        <p>Aucune commande à afficher.</p>
      </main>
    );
  }

  const {
    id: commandeId,
    date_creation,
    statut,
    montant_ttc,
    items = [],
    date_preparation,
    date_expedition,
    date_fermeture,
  } = commande;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleString("fr-CA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const dateStr = fmtDate(date_creation);

  const ttc = Number(montant_ttc ?? 0);

  return (
    <main className="facture-page">
      <h1>Détail de la commande</h1>

      <section className="facture-card">
        <header className="facture-header">
          <div>
            <h2>Commande n° {commandeId}</h2>
            <p>Date : {dateStr}</p>
            <p>
              Statut commande : <strong>{statut || "—"}</strong>
            </p>
            <p>
              Statut paiement : <strong>PAYEE</strong>
            </p>
          </div>
        </header>

        {/*  Dates  */}
        <div className="facture-summary" style={{ marginTop: 10 }}>
          <div className="facture-summary-line">
            <span>Date préparation :</span>
            <strong>{fmtDate(date_preparation)}</strong>
          </div>
          <div className="facture-summary-line">
            <span>Date expédition :</span>
            <strong>{fmtDate(date_expedition)}</strong>
          </div>
          <div className="facture-summary-line">
            <span>Date fermeture :</span>
            <strong>{fmtDate(date_fermeture)}</strong>
          </div>
        </div>

        {items.length > 0 && (
          <div className="facture-items">
            <h3>Produits achetés</h3>
            <table className="facture-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix unitaire</th>
                  <th>Quantité</th>
                  <th>Total ligne</th>
                </tr>
              </thead>
              <tbody>
                {items.map((ligne) => {
                  const price = Number(ligne.prix_unitaire ?? 0);
                  const qte = Number(ligne.quantite ?? 0);
                  const totalLigne =
                    ligne.total_ligne != null
                      ? Number(ligne.total_ligne)
                      : price * qte;

                  return (
                    <tr key={ligne.id}>
                      <td>{ligne.nom_produit}</td>
                      <td>{price.toFixed(2)} $</td>
                      <td>{qte}</td>
                      <td>{totalLigne.toFixed(2)} $</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="facture-summary">
          <div className="facture-summary-line total">
            <span>Total TTC :</span>
            <strong>{ttc.toFixed(2)} $</strong>
          </div>
        </div>

        <footer className="facture-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate("/portail-client/commandes")}
          >
            Retour à mes commandes
          </button>
        </footer>
      </section>
    </main>
  );
}

export default DetailCommandeClient;
