import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addProduit } from "../../store/produitsSlice";
import {
  fetchFournisseurs,
  selectFournisseurs,
} from "../../store/fournisseursSlice";

import "../../styles/ProduitsMagasinier.css";

function ProduitNouveauMagasinier() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    image: null,
  });

  useEffect(() => {
    dispatch(fetchFournisseurs());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  FormData pour image + données
    const fd = new FormData();

    fd.append("sku", form.sku.trim());
    fd.append("nom", form.nom.trim());
    fd.append("coutAchat", String(Number(form.coutAchat) || 0));
    fd.append("prixVente", String(Number(form.prixVente) || 0));
    fd.append("quantite_dispo", String(Number(form.quantite_dispo) || 0));
    fd.append("categorieProduit", form.categorieProduit.trim());
    fd.append("statut", form.statut);
    fd.append("delaiLivraison", String(Number(form.delaiLivraison) || 0));
    fd.append(
      "seuilReapprovisionnement",
      String(Number(form.seuilReapprovisionnement) || 0)
    );
    fd.append("stockMinimum", String(Number(form.stockMinimum) || 0));

    if (form.fournisseurId) {
      fd.append("fournisseurId", String(Number(form.fournisseurId)));
    }

    if (form.image) {
      fd.append("image", form.image);
    }

    try {
      await dispatch(addProduit(fd)).unwrap();
      alert("Produit ajouté avec succès !");
      navigate("/portail-magasinier/produits");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du produit.");
    }
  };

  return (
    <div className="page-container">
      <button
        className="btn-secondary"
        onClick={() => navigate("/portail-magasinier/produits")}
        style={{ marginBottom: "1rem" }}
      >
        ← Retour à la liste
      </button>

      <h1>Ajouter un produit</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        {/* SKU */}
        <div className="form-row">
          <label>SKU *</label>
          <input name="sku" value={form.sku} onChange={handleChange} required />
        </div>

        {/* Nom */}
        <div className="form-row">
          <label>Nom *</label>
          <input name="nom" value={form.nom} onChange={handleChange} required />
        </div>

        {/* Image */}
        <div className="form-row">
          <label>Image du produit</label>

          <label className="file-upload-btn">
            📷 Choisir une image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          {form.image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(form.image)}
                alt="Aperçu"
              />
              <small>{form.image.name}</small>
            </div>
          )}
        </div>

        {/* Coût achat */}
        <div className="form-row">
          <label>Coût d’achat</label>
          <input
            type="number"
            name="coutAchat"
            value={form.coutAchat}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        {/* Prix vente */}
        <div className="form-row">
          <label>Prix de vente</label>
          <input
            type="number"
            name="prixVente"
            value={form.prixVente}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        {/* Quantité */}
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

        {/* Catégorie */}
        <div className="form-row">
          <label>Catégorie</label>
          <input
            name="categorieProduit"
            value={form.categorieProduit}
            onChange={handleChange}
          />
        </div>

        {/* Statut */}
        <div className="form-row">
          <label>Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange}>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        {/* Délai */}
        <div className="form-row">
          <label>Délai de livraison (jours)</label>
          <input
            type="number"
            name="delaiLivraison"
            value={form.delaiLivraison}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Seuil */}
        <div className="form-row">
          <label>Seuil de réapprovisionnement</label>
          <input
            type="number"
            name="seuilReapprovisionnement"
            value={form.seuilReapprovisionnement}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Stock minimum */}
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

        {/* Fournisseur */}
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

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Ajouter le produit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProduitNouveauMagasinier;
