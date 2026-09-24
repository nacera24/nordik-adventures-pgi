
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchProduits } from "../../store/produitsSlice";
import { addAuPanier } from "../../store/panierClientSlice";
import { selectAuth } from "../../store/authSlice";

import "../../styles/Catalogue.css"; 

function ProduitClient() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Produits
  const { items: produits = [], loading, error } = useSelector(
    (state) => state.produits
  );

  // Auth depuis Redux 
  const { user, loading: authLoading } = useSelector(selectAuth);
  const userId = user?.id || null;
  const role = user?.role || null;

  const [msg, setMsg] = useState(null);

  useEffect(() => {
    dispatch(fetchProduits());
  }, [dispatch]);

  const getImage = (p) => p.image_url || p.image || "/images/no-image.png";

  const ajouterAuPanier = async (produitId) => {
    setMsg(null);

    //  bloque si pas client connecté
    if (!userId || role !== "client") {
      alert("Vous devez être connecté en tant que client pour ajouter au panier.");
      navigate("/connexion");
      return;
    }

    try {
      await dispatch(addAuPanier({ userId, produitId, quantite: 1 })).unwrap();

      setMsg("✅ Produit ajouté au panier !");
      setTimeout(() => setMsg(null), 2000);
    } catch (e) {
      console.error("Erreur addAuPanier:", e);
      setMsg(`❌ ${String(e)}`);
    }
  };

  // session
  if (authLoading && !user) {
    return <p style={{ padding: 16 }}>Vérification de la session...</p>;
  }

  if (!user || role !== "client") {
    return (
      <p style={{ padding: 16 }}>
        Vous devez être connecté en tant que client pour voir ce catalogue.
      </p>
    );
  }

  //  produits
  if (loading) return <p style={{ padding: 16 }}>Chargement des produits...</p>;
  if (error)
    return (
      <p className="text-danger" style={{ padding: 16 }}>
        {error}
      </p>
    );

  return (
    <div className="catalogue-page container my-4">
      <h1 className="catalogue-title mb-3">Nos Produits</h1>

      {msg && (
        <div className="alert alert-info" role="alert">
          {msg}
        </div>
      )}

      <div className="row g-4">
        {produits.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <div className="catalogue-card card h-100 shadow-sm">
              <div className="catalogue-img-wrapper">
                <img src={getImage(p)} alt={p.nom} className="card-img-top" />
              </div>

              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title catalogue-card-title">{p.nom}</h5>

                <p className="fw-bold catalogue-card-price">
                  {Number(p.prixVente ?? 0).toFixed(2)} $
                </p>

                <div className="d-grid gap-2 mt-auto">
                  <button
                    className="btn btn-primary catalogue-btn"
                    onClick={() => ajouterAuPanier(p.id)}
                  >
                    Ajouter au panier
                  </button>

                  <button
                    className="btn btn-outline-primary catalogue-btn"
                    onClick={() => navigate(`/portail-client/produits/${p.id}`)}
                  >
                    Voir le détail
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {produits.length === 0 && (
          <p className="text-center mt-4">Aucun produit.</p>
        )}
      </div>
    </div>
  );
}

export default ProduitClient;
