// src/pages/DetailProduit.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import {
  fetchProduitById,
  selectProduitCourant,
  selectProduitsLoading,
  selectProduitsError,
} from "../store/produitsSlice";

import { addAuPanier } from "../store/panierClientSlice";
import { selectAuth } from "../store/authSlice";

import "../styles/DetailProduit.css";

function DetailProduit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ produit
  const produit = useSelector(selectProduitCourant);
  const loading = useSelector(selectProduitsLoading);
  const error = useSelector(selectProduitsError);

  // ✅ user connecté depuis Redux (PAS localStorage)
  const { user, loading: authLoading } = useSelector(selectAuth);
  const userId = user?.id || null;
  const role = user?.role || null;

  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchProduitById(id));
  }, [dispatch, id]);

  const isClientPortal = location.pathname.startsWith("/portail-client");

  const handleRetour = () => {
    if (isClientPortal) navigate("/portail-client/produits");
    else navigate("/catalogue");
  };

  const handleAjouterPanier = async () => {
    setMsg(null);

    // ✅ ici on bloque si pas client connecté
    if (!userId || role !== "client") {
      alert("Vous devez être connecté en tant que client pour ajouter au panier.");
      navigate("/connexion");
      return;
    }

    if (!produit?.id) {
      alert("Produit invalide.");
      return;
    }

    try {
      await dispatch(
        addAuPanier({
          userId,
          produitId: produit.id,
          quantite: 1,
        })
      ).unwrap();

      setMsg("✅ Produit ajouté au panier !");
      setTimeout(() => setMsg(null), 2000);
    } catch (e) {
      console.error("Erreur addAuPanier:", e);
      setMsg(`❌ ${String(e)}`);
    }
  };

  // ✅ gestion session
  if (authLoading && !user) return <p>Vérification de la session...</p>;

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!produit) return <p>Produit introuvable.</p>;

  // ✅ image: backend renvoie image_url
  const imageUrl = produit.image_url || produit.image || "/images/no-image.png";

  return (
    <div className="product-detail container my-5">
      <button className="btn btn-secondary mb-3" onClick={handleRetour}>
        ← Retour au catalogue
      </button>

      {msg && (
        <div className="alert alert-info" role="alert">
          {msg}
        </div>
      )}

      <div className="product-detail-card">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-5">
            <div className="product-detail-image-wrapper">
              <img
                src={imageUrl}
                alt={produit.nom}
                className="product-detail-image"
              />
            </div>
          </div>

          <div className="col-12 col-md-7">
            <h1 className="product-detail-title">{produit.nom}</h1>

            <p className="product-detail-sku">
              <span>SKU :</span> {produit.sku || "—"}
            </p>

            <p className="product-detail-category">
              <span>Catégorie :</span> {produit.categorieProduit || "—"}
            </p>

            <p className="product-detail-category">
              <span>Fournisseur :</span> {produit.fournisseur?.nom || "—"}
            </p>

            <h3 className="product-detail-price">
              {Number(produit.prixVente ?? 0).toFixed(2)} $
            </h3>

            <div className="product-detail-meta">
              <p>
                <span>Quantité disponible :</span>{" "}
                {produit.quantite_dispo ?? "—"}
              </p>
              <p>
                <span>Statut :</span> {produit.statut || "—"}
              </p>
              <p>
                <span>Délai livraison :</span>{" "}
                {produit.delaiLivraison ?? "—"} jours
              </p>
            </div>

            {/* ✅ bouton فقط في portail client */}
            {isClientPortal && (
              <button className="btn btn-success mt-3" onClick={handleAjouterPanier}>
                Ajouter au panier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduit;
