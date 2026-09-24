import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/FacturesAchatFinancier.css";

import {
  fetchCommandeAchatById,
  selectCommandeAchatById,
  selectCommandeAchatLoading,
  selectCommandeAchatError,
} from "../../store/commandeAchatSlice";

const fmtDate = (v) => (v ? new Date(v).toLocaleString("fr-CA") : "-");

export default function SommaireAchatFinancier() {
  const { id } = useParams();
  const commandeId = Number(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectCommandeAchatLoading);
  const error = useSelector(selectCommandeAchatError);

  const commande = useSelector(selectCommandeAchatById(commandeId));

  useEffect(() => {
    if (!commande) dispatch(fetchCommandeAchatById(commandeId));
  }, [dispatch, commandeId, commande]);

  const printPage = () => window.print();

  if (loading && !commande)
    return (
      <main className="fa-container">
        <p>Chargement...</p>
      </main>
    );

  if (error)
    return (
      <main className="fa-container">
        <p className="err">{error}</p>
      </main>
    );

  if (!commande)
    return (
      <main className="fa-container">
        <p>Aucune donnée.</p>
        <button className="btn" onClick={() => navigate(-1)}>
          Retour
        </button>
      </main>
    );

  const fournisseurNom = commande.fournisseur?.nom || "-";
  const paiement = commande.paiement || commande.paiementAchat || null;
  const solde = paiement?.solde ?? commande.total ?? 0;

  return (
    <main className="fa-container">
      <div className="fa-header">
        <h1>Sommaire – Facture d’achat #{commande.id}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => navigate(-1)}>
            Retour
          </button>
          <button className="btn btn-secondary" onClick={printPage}>
            Imprimer
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <p>
          <b>Fournisseur :</b> {fournisseurNom}
        </p>

        {/*  DATES */}
        <p>
          <b>Date de commande :</b> {fmtDate(commande.date_commande)}
        </p>
        <p>
          <b>Date de paiement :</b> {fmtDate(paiement?.date)}
        </p>
        <p>
          <b>Date de réception :</b>{" "}
          {commande.date_reception ? fmtDate(commande.date_reception) : "Non reçue"}
        </p>

        <p>
          <b>Statut commande :</b> {commande.statut}
        </p>
        <p>
          <b>Paiement :</b> {paiement?.statut || "EN_ATTENTE"} {" | "}
          <b>Solde :</b> {Number(solde).toFixed(2)} $
        </p>
      </div>

      <div className="card">
        <h3>Détails</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Produit</th>
              <th style={{ textAlign: "right" }}>Qté</th>
              <th style={{ textAlign: "right" }}>Coût</th>
              <th style={{ textAlign: "right" }}>Sous-total</th>
            </tr>
          </thead>

          <tbody>
            {(commande.items || []).map((it) => {
              const cout = Number(it.coutAchat ?? 0);
              const qte = Number(it.quantite ?? 0);
              return (
                <tr key={it.id}>
                  <td>{it.produitNom || it.produit?.nom || "-"}</td>
                  <td style={{ textAlign: "right" }}>{qte}</td>
                  <td style={{ textAlign: "right" }}>{cout.toFixed(2)} $</td>
                  <td style={{ textAlign: "right" }}>
                    {(cout * qte).toFixed(2)} $
                  </td>
                </tr>
              );
            })}

            {(commande.items || []).length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  Aucune ligne.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 12, maxWidth: 360, marginLeft: "auto" }}>
          <p>
            <b>Sous-total :</b> {Number(commande.sous_total ?? 0).toFixed(2)} $
          </p>
          <p>
            <b>TPS :</b> {Number(commande.tps ?? 0).toFixed(2)} $
          </p>
          <p>
            <b>TVQ :</b> {Number(commande.tvq ?? 0).toFixed(2)} $
          </p>
          <p style={{ fontSize: 18 }}>
            <b>Total :</b> {Number(commande.total ?? 0).toFixed(2)} $
          </p>
        </div>
      </div>
    </main>
  );
}
