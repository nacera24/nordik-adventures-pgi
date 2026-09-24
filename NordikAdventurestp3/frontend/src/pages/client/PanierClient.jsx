import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchPanier,
  selectPanierItems,
  selectPanierLoading,
  selectPanierError,
  selectPanierTotal,
  updateQuantiteItem,
  removeItemPanier,
} from "../../store/panierClientSlice";

import { selectAuth } from "../../store/authSlice";

import "../../styles/PanierClient.css";

function PanierClient() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // utilisateur connecté (authSlice)
  const { user, loading: authLoading } = useSelector(selectAuth);
  const userId = user?.id || null;
  const role = user?.role || null;

  const items = useSelector(selectPanierItems);
  const loading = useSelector(selectPanierLoading);
  const errorGlobal = useSelector(selectPanierError);
  const total = useSelector(selectPanierTotal);

  // erreurs par item (quantité)
  const [qteErrors, setQteErrors] = useState({});

  // Charger le panier
  useEffect(() => {
    if (userId && role === "client") {
      dispatch(fetchPanier(userId));
    }
  }, [dispatch, userId, role]);

  // Nettoyer les erreurs item si l'item n'existe plus
  useEffect(() => {
    const ids = new Set((items || []).map((it) => it.id));
    setQteErrors((prev) => {
      const next = {};
      for (const k in prev) {
        const id = Number(k);
        if (ids.has(id) && prev[k]) next[k] = prev[k];
      }
      return next;
    });
  }, [items]);

  const handleChangeQuantite = async (item, nouvelleQuantite) => {
    const q = Number(nouvelleQuantite);
    if (Number.isNaN(q) || q <= 0) return;

    // efface l’erreur de cet item
    setQteErrors((prev) => ({ ...prev, [item.id]: null }));

    try {
      await dispatch(updateQuantiteItem({ itemId: item.id, quantite: q })).unwrap();
    } catch (e) {
      // affiche l’erreur juste à côté de la quantité
      setQteErrors((prev) => ({ ...prev, [item.id]: String(e) }));
    }
  };

  const handleRemove = async (item) => {
    if (!window.confirm("Supprimer cet article du panier ?")) return;

    setQteErrors((prev) => ({ ...prev, [item.id]: null }));

    try {
      await dispatch(removeItemPanier(item.id)).unwrap();
    } catch (e) {
      setQteErrors((prev) => ({ ...prev, [item.id]: String(e) }));
    }
  };

  // Taxes (Québec : TPS 5% + TVQ 9,975 %)
  const TPS = 0.05;
  const TVQ = 0.09975;

  const montantTPS = total * TPS;
  const montantTVQ = total * TVQ;
  const totalTTC = total + montantTPS + montantTVQ;

  const handlePayer = () => {
    if (!items || items.length === 0) return;
    navigate("/portail-client/paiement");
  };

  // Session
  if (authLoading && !user) {
    return (
      <main className="client-panier">
        <p>Vérification de votre session...</p>
      </main>
    );
  }

  if (!user || role !== "client") {
    return (
      <main className="client-panier">
        <p>Vous devez être connecté en tant que client pour voir votre panier.</p>
      </main>
    );
  }

  // Panier loading
  if (loading) {
    return (
      <main className="client-panier">
        <p>Chargement du panier...</p>
      </main>
    );
  }

  return (
    <main className="client-panier">
      <h1>Mon panier</h1>

      {/* erreur globale */}
      {errorGlobal && <p className="error-message">{errorGlobal}</p>}

      {!items || items.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <>
          <table className="panier-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const prod = item.produit || {};

                const price = Number(prod.prixVente ?? 0);
                const name = prod.nom || "";
                const img =
                  prod.image_url ||
                  prod.image ||
                  "/images/placeholder-product.jpg";

                const qte = Number(item.quantite ?? 0);
                const lineTotal = price * qte;

                // Stock + seuils 
                const dispo = Number(prod.quantite_dispo ?? 0);
                const seuilReap = Number(prod.seuilReapprovisionnement ?? 0);
                const stockMin = Number(prod.stockMinimum ?? 0);

                const isCritical = stockMin > 0 && dispo <= stockMin; // rouge
                const isLow = !isCritical && seuilReap > 0 && dispo <= seuilReap; // orange

                return (
                  <tr key={item.id}>
                    <td className="panier-produit-cell">
                      <img src={img} alt={name} className="panier-image" />
                      <span>{name}</span>
                    </td>

                    <td>{price.toFixed(2)} $</td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        value={qte}
                        onChange={(e) =>
                          handleChangeQuantite(item, e.target.value)
                        }
                        className="panier-quantite-input"
                      />

                
                      {qteErrors[item.id] && (
                        <div className="qte-error">{qteErrors[item.id]}</div>
                      )}

                      {/* warning seuil (même si quantité OK) */}
                      {!qteErrors[item.id] && (isCritical || isLow) && (
                        <div className={isCritical ? "qte-alert" : "qte-warning"}>
                          {isCritical
                            ? `🚨 Stock critique : reste ${dispo} (minimum ${stockMin})`
                            : `⚠️ Stock bas : reste ${dispo} (seuil ${seuilReap})`}
                        </div>
                      )}
                    </td>

                    <td>{lineTotal.toFixed(2)} $</td>

                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemove(item)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Résumé + paiement */}
          <div className="panier-resume-vertical">
            <div className="resume-line">
              <span>Sous-total :</span>
              <strong>{total.toFixed(2)} $</strong>
            </div>

            <div className="resume-line">
              <span>TPS (5 %) :</span>
              <strong>{montantTPS.toFixed(2)} $</strong>
            </div>

            <div className="resume-line">
              <span>TVQ (9,975 %) :</span>
              <strong>{montantTVQ.toFixed(2)} $</strong>
            </div>

            <div className="resume-line total-final">
              <span>Total à payer :</span>
              <strong>{totalTTC.toFixed(2)} $</strong>
            </div>

            <button className="btn-paiement" onClick={handlePayer}>
              Procéder au paiement
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default PanierClient;
