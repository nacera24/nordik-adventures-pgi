import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/NouvelleCommandeFinancier.css";

import {
  fetchProduitsParFournisseur,
  selectProduits,
  selectProduitsLoading,
  selectProduitsError,
  clearProduitsError,
} from "../../store/produitsSlice";

import {
  fetchFournisseurs,
  selectFournisseurs,
} from "../../store/fournisseursSlice";

import {
  creerCommandeAchat,
  selectCommandeAchatLoading,
  selectCommandeAchatError,
  clearCommandeAchatError,
} from "../../store/commandeAchatSlice";

const TPS_RATE = 0.05;
const TVQ_RATE = 0.09975; 

function NouvelleCommandeFinancier() {
  const dispatch = useDispatch();

  // produits (filtrés par fournisseur)
  const produits = useSelector(selectProduits);
  const produitsLoading = useSelector(selectProduitsLoading);
  const produitsError = useSelector(selectProduitsError);

  // fournisseurs
  const fournisseurs = useSelector(selectFournisseurs);

  // création commande
  const saving = useSelector(selectCommandeAchatLoading);
  const saveError = useSelector(selectCommandeAchatError);


  const [fournisseurId, setFournisseurId] = useState("");
  const [quantites, setQuantites] = useState({});
  const [lignes, setLignes] = useState([]); // [{ produitId, quantite }]
  const [uiError, setUiError] = useState(null);

  useEffect(() => {
    dispatch(fetchFournisseurs());
    return () => {
      dispatch(clearCommandeAchatError());
      dispatch(clearProduitsError());
    };
  }, [dispatch]);

  // dès qu'on choisit un fournisseur => charger ses produits
  useEffect(() => {
    setUiError(null);
    dispatch(clearProduitsError());

    // reset lignes si on change de fournisseur 
  
    setLignes([]);
    setQuantites({});

    if (fournisseurId) {
      dispatch(fetchProduitsParFournisseur(Number(fournisseurId)));
    }
  }, [dispatch, fournisseurId]);

  const produitById = useMemo(() => {
    const map = new Map();
    produits.forEach((p) => map.set(p.id, p));
    return map;
  }, [produits]);

  const handleChangeQte = (produitId, value) => {
    setQuantites((prev) => ({
      ...prev,
      [produitId]: Math.max(1, Number(value) || 1),
    }));
  };

  const handleAjouterLigne = (produit) => {
    if (!fournisseurId) {
      setUiError("Veuillez choisir un fournisseur avant d’ajouter des produits.");
      return;
    }

    const qte = quantites[produit.id] || 1;

    setLignes((prev) => {
      const exist = prev.find((l) => l.produitId === produit.id);
      if (exist) {
        return prev.map((l) =>
          l.produitId === produit.id
            ? { ...l, quantite: l.quantite + qte }
            : l
        );
      }
      return [...prev, { produitId: produit.id, quantite: qte }];
    });
  };

  const handleSupprimerLigne = (produitId) => {
    setLignes((prev) => prev.filter((l) => l.produitId !== produitId));
  };

  const handleModifierQuantiteLigne = (produitId, value) => {
    const qte = Math.max(1, Number(value) || 1);
    setLignes((prev) =>
      prev.map((l) => (l.produitId === produitId ? { ...l, quantite: qte } : l))
    );
  };

  // ====== CALCULS (Sous-total, TPS, TVQ, Total) ======
  const sousTotal = useMemo(() => {
    return lignes.reduce((sum, l) => {
      const p = produitById.get(l.produitId);
      const cout = Number(p?.coutAchat ?? 0);
      return sum + cout * l.quantite;
    }, 0);
  }, [lignes, produitById]);

  const tps = useMemo(() => sousTotal * TPS_RATE, [sousTotal]);
  const tvq = useMemo(() => sousTotal * TVQ_RATE, [sousTotal]);
  const totalTTC = useMemo(() => sousTotal + tps + tvq, [sousTotal, tps, tvq]);

  const handleValiderCommandeAchat = async () => {
    setUiError(null);
    dispatch(clearCommandeAchatError());

    if (!fournisseurId) {
      setUiError("Veuillez choisir un fournisseur.");
      return;
    }
    if (lignes.length === 0) {
      setUiError("Ajoutez au moins un produit à la commande.");
      return;
    }

    const payload = {
      fournisseurId: Number(fournisseurId),
      lignes: lignes.map((l) => ({
        produitId: l.produitId,
        quantite: l.quantite,
      })),
      sousTotal,
      tps,
      tvq,
      total: totalTTC,
    };

    try {
      await dispatch(creerCommandeAchat(payload)).unwrap();
      alert("Commande d’achat créée ✅ (statut EN_ATTENTE)");
      setLignes([]);
      setQuantites({});
      setFournisseurId("");
    } catch (e) {
      setUiError(e);
    }
  };

  return (
    <div className="commande-layout">
      {/* Catalogue à gauche */}
      <section className="commande-catalogue">
        <h1>Créer une commande d’achat</h1>
        <p>Choisissez un fournisseur, puis ajoutez des produits.</p>

        {/* Fournisseur */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
            Fournisseur *
          </label>
          <select
            value={fournisseurId}
            onChange={(e) => setFournisseurId(e.target.value)}
            style={{ padding: "10px", borderRadius: 8, width: "100%" }}
          >
            <option value="">-- Choisir un fournisseur --</option>
            {fournisseurs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom}
              </option>
            ))}
          </select>
        </div>

        {!fournisseurId && (
          <p style={{ color: "#555", marginTop: 10 }}>
            👉 Choisissez un fournisseur pour afficher ses produits.
          </p>
        )}

        {produitsLoading && fournisseurId && <p>Chargement des produits...</p>}
        {produitsError && <p style={{ color: "red" }}>{produitsError}</p>}

        {!produitsLoading && !produitsError && fournisseurId && (
          <table className="commande-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Coût achat</th>
                <th>Quantité</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p.id}>
                  <td>{p.nom}</td>
                  <td>{Number(p.coutAchat ?? 0).toFixed(2)} $</td>
                  <td style={{ width: 140 }}>
                    <input
                      type="number"
                      min="1"
                      value={quantites[p.id] || 1}
                      onChange={(e) => handleChangeQte(p.id, e.target.value)}
                    />
                  </td>
                  <td style={{ width: 180 }}>
                    <button onClick={() => handleAjouterLigne(p)}>Ajouter</button>
                  </td>
                </tr>
              ))}

              {produits.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: 14, color: "#666" }}>
                    Aucun produit trouvé pour ce fournisseur.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {(uiError || saveError) && (
          <p style={{ color: "red", marginTop: 12 }}>{uiError || saveError}</p>
        )}
      </section>

      {/* Panier à droite */}
      <aside className="commande-panier">
        <h2>Lignes de la commande</h2>

        {lignes.length === 0 ? (
          <p>Aucun produit ajouté.</p>
        ) : (
          <>
            <ul className="panier-liste">
              {lignes.map((l) => {
                const p = produitById.get(l.produitId);
                const nom = p?.nom ?? `Produit #${l.produitId}`;
                const cout = Number(p?.coutAchat ?? 0);

                return (
                  <li key={l.produitId} className="panier-item">
                    <div>
                      <strong>{nom}</strong>
                      <div style={{ marginTop: 6 }}>
                        <span style={{ marginRight: 8 }}>
                          Coût: {cout.toFixed(2)} $
                        </span>
                        <span style={{ marginRight: 8 }}>×</span>
                        <input
                          type="number"
                          min="1"
                          value={l.quantite}
                          onChange={(e) =>
                            handleModifierQuantiteLigne(
                              l.produitId,
                              e.target.value
                            )
                          }
                          style={{ width: 80 }}
                        />
                        <span style={{ marginLeft: 10 }}>
                          = {(cout * l.quantite).toFixed(2)} $
                        </span>
                      </div>
                    </div>

                    <button onClick={() => handleSupprimerLigne(l.produitId)}>
                      Supprimer
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="panier-resume">
              <div>
                <span>Sous-total :</span>
                <span>{sousTotal.toFixed(2)} $</span>
              </div>

              <div>
                <span>TPS (5 %) :</span>
                <span>{tps.toFixed(2)} $</span>
              </div>

              <div>
                <span>TVQ (9,975 %) :</span>
                <span>{tvq.toFixed(2)} $</span>
              </div>

              <div className="panier-total">
                <span>Total :</span>
                <span>{totalTTC.toFixed(2)} $</span>
              </div>

              <button
                className="btn-valider"
                onClick={handleValiderCommandeAchat}
                disabled={saving}
              >
                {saving ? "Enregistrement..." : "Créer la commande d’achat"}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default NouvelleCommandeFinancier;
