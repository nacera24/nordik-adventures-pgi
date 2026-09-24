
import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectAuth } from "../../store/authSlice";
import { selectPanierItems, selectPanierTotal } from "../../store/panierClientSlice";
import { payerCommandeClient } from "../../store/factureClientSlice";
import { envoyerSatisfaction } from "../../store/satisfactionClientSlice";

import "../../styles/PaiementClient.css";

export default function PaiementClient() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth
  const { user } = useSelector(selectAuth);
  const userId = user?.id || null;
  const role = user?.role || null;

  // Panier
  const items = useSelector(selectPanierItems);
  const total = useSelector(selectPanierTotal);

  // Form (mock)
  const [form, setForm] = useState({
    nomCarte: "",
    numeroCarte: "",
    exp: "",
    cvc: "",
    adresse: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  // Satisfaction
  const [showBar, setShowBar] = useState(false);
  const [sendingAvis, setSendingAvis] = useState(false);
  const [commandeId, setCommandeId] = useState(null);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");

  // Taxes Québec
  const TPS = 0.05;
  const TVQ = 0.09975;

  const montantTPS = useMemo(() => Number(total) * TPS, [total]);
  const montantTVQ = useMemo(() => Number(total) * TVQ, [total]);
  const totalTTC = useMemo(
    () => Number(total) + montantTPS + montantTVQ,
    [total, montantTPS, montantTVQ]
  );

  const validate = () => {
    if (!form.nomCarte.trim()) return "Veuillez saisir le nom sur la carte.";
    if (!form.numeroCarte.trim()) return "Veuillez saisir le numéro de carte.";
    if (!form.exp.trim()) return "Veuillez saisir la date d’expiration.";
    if (!form.cvc.trim()) return "Veuillez saisir le CVC.";
    if (!form.adresse.trim()) return "Veuillez saisir l’adresse de facturation.";
    return null;
  };

  const onChange = (e) => {
    setMsg(null);
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleRetourPanier = () => navigate("/portail-client/panier");

  const goToCommandeDetail = (id) => {
    if (id) navigate(`/portail-client/commandes/${id}`);
    else navigate("/portail-client/commandes");
  };

  const handlePasserAvis = () => {
    setShowBar(false);
    goToCommandeDetail(commandeId);
  };

  const handleValiderAvis = async () => {
    setMsg(null);

    if (!userId || role !== "client") {
      setMsg("Vous devez être connecté en tant que client.");
      return;
    }
    if (!commandeId) {
      setMsg("Commande introuvable pour enregistrer l'avis.");
      return;
    }
    if (!note || note < 1 || note > 5) {
      setMsg("Veuillez choisir une note entre 1 et 5 étoiles.");
      return;
    }

    try {
      setSendingAvis(true);

      await dispatch(
        envoyerSatisfaction({
          clientId: userId,
          commandeId,
          note,
          commentaire,
        })
      ).unwrap();

      setShowBar(false);
      goToCommandeDetail(commandeId);
    } catch (e) {
      // Même si avis échoue, on n'empêche pas le client de continuer
      setShowBar(false);
      goToCommandeDetail(commandeId);
    } finally {
      setSendingAvis(false);
    }
  };

  const handlePayer = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!userId || role !== "client") {
      setMsg("Vous devez être connecté en tant que client.");
      return;
    }
    if (!items || items.length === 0) {
      setMsg("Votre panier est vide.");
      return;
    }

    const err = validate();
    if (err) {
      setMsg(err);
      return;
    }

    try {
      setSubmitting(true);

      const facture = await dispatch(
        payerCommandeClient({
          clientId: userId,
          mode: "carte",
        })
      ).unwrap();

      // commande_id renvoyé par backend
      const cid = facture?.commande_id || facture?.commandeId || null;
      setCommandeId(cid);

      // Afficher barre satisfaction
      setNote(0);
      setCommentaire("");
      setShowBar(true);
    } catch (error) {
      setMsg(String(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || role !== "client") {
    return (
      <main className="paiement-page">
        <h1>Paiement</h1>
        <p>Vous devez être connecté en tant que client.</p>
      </main>
    );
  }

  return (
    <main className="paiement-page">
      <h1>Paiement</h1>

      <button className="btn-retour-panier" onClick={handleRetourPanier}>
        ← Retour au panier
      </button>

      {msg && <div className="paiement-alert">{msg}</div>}

      <div className="paiement-grid">
        {/* Récap commande */}
        <section className="paiement-card">
          <h2>Récapitulatif</h2>

          {!items || items.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <>
              <div className="recap-items">
                {items.map((it) => {
                  const prod = it.produit || {};
                  const name = prod.nom || "Produit";
                  const qte = Number(it.quantite ?? 0);
                  const price = Number(prod.prixVente ?? 0);
                  const line = qte * price;

                  return (
                    <div className="recap-row" key={it.id}>
                      <div>
                        <div className="recap-name">{name}</div>
                        <div className="recap-meta">
                          Qté: <strong>{qte}</strong> • {price.toFixed(2)} $ / unité
                        </div>
                      </div>
                      <div className="recap-right">{line.toFixed(2)} $</div>
                    </div>
                  );
                })}
              </div>

              <div className="totaux">
                <div className="totaux-line">
                  <span>HT :</span>
                  <strong>{Number(total).toFixed(2)} $</strong>
                </div>
                <div className="totaux-line">
                  <span>TPS :</span>
                  <strong>{montantTPS.toFixed(2)} $</strong>
                </div>
                <div className="totaux-line">
                  <span>TVQ :</span>
                  <strong>{montantTVQ.toFixed(2)} $</strong>
                </div>
                <div className="totaux-line total">
                  <span>Total :</span>
                  <strong>{totalTTC.toFixed(2)} $</strong>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Form paiement */}
        <section className="paiement-card">
          <h2>Informations de paiement</h2>

          <form onSubmit={handlePayer} className="paiement-form">
            <input
              name="nomCarte"
              value={form.nomCarte}
              onChange={onChange}
              placeholder="Nom sur la carte"
              className="paiement-input"
            />

            <input
              name="numeroCarte"
              value={form.numeroCarte}
              onChange={onChange}
              placeholder="Numéro de carte"
              className="paiement-input"
            />

            <div className="paiement-row">
              <input
                name="exp"
                value={form.exp}
                onChange={onChange}
                placeholder="MM/AA"
                className="paiement-input"
              />
              <input
                name="cvc"
                value={form.cvc}
                onChange={onChange}
                placeholder="CVC"
                className="paiement-input"
              />
            </div>

            <input
              name="adresse"
              value={form.adresse}
              onChange={onChange}
              placeholder="Adresse de facturation"
              className="paiement-input"
            />

            <button
              className="btn-payer"
              type="submit"
              disabled={submitting || !items?.length}
            >
              {submitting ? "Paiement..." : "Payer maintenant"}
            </button>

          </form>
        </section>
      </div>

      {/* BARRE SATISFACTION (2 LIGNES) */}
      {showBar && (
        <div className="sat-bar">
          <div className="sat-inner">
            {/* ligne 1 */}
            <div className="sat-row sat-top">
              <div className="sat-text">Évaluez votre expérience</div>

              <div className="sat-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= note ? "sat-star selected" : "sat-star"}
                    onClick={() => setNote(star)}
                    disabled={sendingAvis}
                    aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* ligne 2 */}
            <div className="sat-row sat-bottom">
              <input
                className="sat-input"
                placeholder="Commentaire (optionnel)"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                disabled={sendingAvis}
              />

              <div className="sat-actions">
                <button
                  type="button"
                  className="sat-btn secondary"
                  onClick={handlePasserAvis}
                  disabled={sendingAvis}
                >
                  Plus tard
                </button>

                <button
                  type="button"
                  className="sat-btn primary"
                  onClick={handleValiderAvis}
                  disabled={sendingAvis || note === 0}
                >
                  {sendingAvis ? "Envoi..." : "Valider"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
