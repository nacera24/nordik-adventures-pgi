import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/FacturesAchatFinancier.css";

import {
  fetchCommandeAchatById,
  fetchCommandesAchat,
  payerCommandeAchat,
  selectCommandeAchatById,
  selectCommandeAchatLoading,
  selectCommandeAchatError,
} from "../../store/commandeAchatSlice";

const fmtDate = (v) => (v ? new Date(v).toLocaleString("fr-CA") : "-");

export default function FactureAchatDetails() {
  const { id } = useParams();
  const commandeId = Number(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectCommandeAchatLoading);
  const error = useSelector(selectCommandeAchatError);

  const commande = useSelector(selectCommandeAchatById(commandeId));

  const [montant, setMontant] = useState("");
  const [mode, setMode] = useState("carte");
  const [uiError, setUiError] = useState(null);

  useEffect(() => {
    dispatch(fetchCommandesAchat());
    dispatch(fetchCommandeAchatById(commandeId));
  }, [dispatch, commandeId]);

  const payer = async () => {
    setUiError(null);
    const m = Number(montant);
    if (!m || m <= 0) return setUiError("Montant invalide.");

    try {
      await dispatch(payerCommandeAchat({ commandeId, montant: m, mode })).unwrap();
      setMontant("");
      dispatch(fetchCommandeAchatById(commandeId));
      dispatch(fetchCommandesAchat());
    } catch (e) {
      setUiError(String(e));
    }
  };

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
        <p>Commande introuvable (id={commandeId}).</p>
        <button
          className="btn"
          onClick={() => navigate("/portail-financier/factures")}
        >
          Retour
        </button>
      </main>
    );

  const paiement = commande.paiement || commande.paiementAchat || null;
  const solde = paiement?.solde ?? commande.total ?? 0;

  return (
    <main className="fa-container">
      <div className="fa-header">
        <h1>Facture d’achat #{commande.id}</h1>
        <button
          className="btn"
          onClick={() => navigate("/portail-financier/factures")}
        >
          Retour
        </button>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <p>
          <b>Fournisseur:</b> {commande.fournisseur?.nom || "-"}
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
          <b>Statut commande:</b> {commande.statut}
        </p>
        <p>
          <b>Statut paiement:</b> {paiement?.statut || "EN_ATTENTE"}
        </p>
        <p>
          <b>Payé:</b> {Number(paiement?.montant_paye ?? 0).toFixed(2)} $
        </p>
        <p>
          <b>Solde:</b> {Number(solde).toFixed(2)} $
        </p>
      </div>

      <div className="card">
        <h3>Lignes</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Qté</th>
              <th>Coût</th>
              <th>Sous-total</th>
            </tr>
          </thead>

          <tbody>
            {(commande.items || []).map((it) => {
              const cout = Number(it.coutAchat ?? 0);
              const qte = Number(it.quantite ?? 0);
              return (
                <tr key={it.id}>
                  <td>{it.produitNom || it.produit?.nom || "-"}</td>
                  <td>{qte}</td>
                  <td>{cout.toFixed(2)} $</td>
                  <td>{(cout * qte).toFixed(2)} $</td>
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

        <div style={{ marginTop: 10 }}>
          <p>
            <b>Sous-total:</b> {Number(commande.sous_total ?? 0).toFixed(2)} $
          </p>
          <p>
            <b>TPS:</b> {Number(commande.tps ?? 0).toFixed(2)} $
          </p>
          <p>
            <b>TVQ:</b> {Number(commande.tvq ?? 0).toFixed(2)} $
          </p>
          <p>
            <b>Total:</b> {Number(commande.total ?? 0).toFixed(2)} $
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h3>Payer</h3>
        {uiError && <p className="err">{uiError}</p>}

        <div className="pay-row">
          <input
            type="number"
            step="0.01"
            min="0"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            placeholder="Montant"
          />

          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="carte">Carte</option>
            <option value="virement">Virement</option>
            <option value="cash">Cash</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={payer}
            disabled={Number(solde) <= 0}
          >
            Confirmer
          </button>
        </div>
      </div>
    </main>
  );
}
