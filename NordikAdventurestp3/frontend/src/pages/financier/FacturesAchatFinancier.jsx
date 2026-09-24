import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/FacturesAchatFinancier.css";

import {
  fetchCommandesAchat,
  selectCommandeAchatItems,
  selectCommandeAchatLoading,
  selectCommandeAchatError,
} from "../../store/commandeAchatSlice";

const fmtDate = (v) => (v ? new Date(v).toLocaleString("fr-CA") : "-");

export default function FacturesAchatFinancier() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCommandeAchatItems);
  const loading = useSelector(selectCommandeAchatLoading);
  const error = useSelector(selectCommandeAchatError);

  useEffect(() => {
    dispatch(fetchCommandesAchat());
  }, [dispatch]);

  const goSommaire = (id) =>
    navigate(`/portail-financier/factures/${id}/sommaire`);
  const goDetails = (id) => navigate(`/portail-financier/factures/${id}`);

  return (
    <main className="fa-container">
      <div className="fa-header">
        <h1>Factures d’achat</h1>
        <button className="btn" onClick={() => dispatch(fetchCommandesAchat())}>
          Rafraîchir
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="err">{error}</p>}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fournisseur</th>

              {/*  DATES */}
              <th>Date commande</th>
              <th>Date paiement</th>
              <th>Date réception</th>

              <th>Total</th>
              <th>Statut</th>
              <th>Paiement</th>
              <th>Solde</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {(items || []).map((c) => {
              const paiement = c.paiement || c.paiementAchat || null;
              const solde = paiement?.solde ?? c.total ?? 0;

              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.fournisseur?.nom || "-"}</td>

                  {/* ✅ affichage dates */}
                  <td>{fmtDate(c.date_commande)}</td>
                  <td>{fmtDate(paiement?.date)}</td>
                  <td>{c.date_reception ? fmtDate(c.date_reception) : "Non reçue"}</td>

                  <td>
                    <b>{Number(c.total ?? 0).toFixed(2)} $</b>
                  </td>

                  <td>{c.statut}</td>

                  <td>{paiement?.statut || "EN_ATTENTE"}</td>

                  <td>{Number(solde).toFixed(2)} $</td>

                  <td className="actions">
                    <button className="btn" onClick={() => goDetails(c.id)}>
                      Détails
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => goSommaire(c.id)}
                    >
                      Sommaire
                    </button>
                  </td>
                </tr>
              );
            })}

            {!loading && (items || []).length === 0 && (
              <tr>
                <td colSpan="10" className="empty">
                  Aucune facture d’achat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
