import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProduitById,
  updateProduit,
  selectProduitCourant,
  selectProduitsLoading,
  selectProduitsError,
} from "../../store/produitsSlice";

import {
  fetchFournisseurs,
  selectFournisseurs,
} from "../../store/fournisseursSlice";

import "../../styles/ProduitsMagasinier.css";

function ProduitDetailsMagasinier() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const produit = useSelector(selectProduitCourant);
  const loading = useSelector(selectProduitsLoading);
  const error = useSelector(selectProduitsError);
  const fournisseurs = useSelector(selectFournisseurs);

  const [form, setForm] = useState({
    sku: "",
    nom: "",
    coutAchat: "",
    prixVente: "",
    quantite_dispo: "",
    categorieProduit: "",
    statut: "actif",
    delaiLivraison: "",
    seuilReapprovisionnement: "",
    stockMinimum: "",
    fournisseurId: "",
  });

  // Charger produit + fournisseurs
  useEffect(() => {
    dispatch(fetchProduitById(id));
    dispatch(fetchFournisseurs());
  }, [dispatch, id]);

  // Remplir le formulaire depuis le produit
  useEffect(() => {
    if (produit) {
      setForm({
        sku: produit.sku ?? "",
        nom: produit.nom ?? "",
        coutAchat: produit.coutAchat ?? "",
        prixVente: produit.prixVente ?? "",
        quantite_dispo: produit.quantite_dispo ?? "",
        categorieProduit: produit.categorieProduit ?? "",
        statut: produit.statut ?? "actif",
        delaiLivraison: produit.delaiLivraison ?? "",
        seuilReapprovisionnement: produit.seuilReapprovisionnement ?? "",
        stockMinimum: produit.stockMinimum ?? "",
        fournisseurId: produit.fournisseur?.id ?? "",
      });
    }
  }, [produit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      sku: form.sku.trim(),
      nom: form.nom.trim(),
      coutAchat: Number(form.coutAchat) || 0,
      prixVente: Number(form.prixVente) || 0,
      quantite_dispo: Number(form.quantite_dispo) || 0,
      categorieProduit: form.categorieProduit.trim(),
      statut: form.statut, // "actif" / "inactif"
      delaiLivraison: Number(form.delaiLivraison) || 0,
      seuilReapprovisionnement: Number(form.seuilReapprovisionnement) || 0,
      stockMinimum: Number(form.stockMinimum) || 0,
      fournisseurId: form.fournisseurId ? Number(form.fournisseurId) : null, 
    };

    try {
      await dispatch(updateProduit({ id, data: payload })).unwrap();
      alert("Produit mis à jour avec succès !");
      dispatch(fetchProduitById(id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du produit.");
    }
  };

  if (loading && !produit) {
    return (
      <div className="page-container">
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error && !produit) {
    return (
      <div className="page-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="page-container">
        <p>Produit introuvable.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button
        className="btn-secondary"
        onClick={() => navigate("/portail-magasinier/produits")}
        style={{ marginBottom: "1rem" }}
      >
        ← Retour à la liste
      </button>

      <h1>Fiche produit : {produit.nom}</h1>

      {produit.image && (
        <div style={{ margin: "12px 0" }}>
          <img
            src={produit.image}
            alt={produit.nom}
            style={{ maxWidth: 220, borderRadius: 10 }}
          />
        </div>
      )}

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>SKU *</label>
          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Nom *</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Coût achat</label>
          <input
            type="number"
            name="coutAchat"
            value={form.coutAchat}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-row">
          <label>Prix vente</label>
          <input
            type="number"
            name="prixVente"
            value={form.prixVente}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-row">
          <label>Quantité disponible</label>
          <input
            type="number"
            name="quantite_dispo"
            value={form.quantite_dispo}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-row">
          <label>Catégorie (texte)</label>
          <input
            type="text"
            name="categorieProduit"
            value={form.categorieProduit}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange}>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        <div className="form-row">
          <label>Délai livraison (jours)</label>
          <input
            type="number"
            name="delaiLivraison"
            value={form.delaiLivraison}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-row">
          <label>Seuil réapprovisionnement</label>
          <input
            type="number"
            name="seuilReapprovisionnement"
            value={form.seuilReapprovisionnement}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-row">
          <label>Stock minimum</label>
          <input
            type="number"
            name="stockMinimum"
            value={form.stockMinimum}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-row">
          <label>Fournisseur</label>
          <select
            name="fournisseurId"
            value={form.fournisseurId}
            onChange={handleChange}
          >
            <option value="">-- Choisir --</option>
            {fournisseurs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProduitDetailsMagasinier;
