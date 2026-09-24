
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProduits,
  deleteProduit,
  selectProduits,
  selectProduitsLoading,
  selectProduitsError,
} from "../../store/produitsSlice";
import "../../styles/ProduitsMagasinier.css";

function ProduitsMagasinier() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const produits = useSelector(selectProduits);
  const loading = useSelector(selectProduitsLoading);
  const error = useSelector(selectProduitsError);

  useEffect(() => {
    dispatch(fetchProduits());
  }, [dispatch]);

  const handleVoirProduit = (id) => {
    navigate(`/portail-magasinier/produits/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      dispatch(deleteProduit(id));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestion des produits</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/portail-magasinier/produits/nouveau")}
        >
          + Ajouter un produit
        </button>
      </div>

      {loading && <p>Chargement des produits...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <table className="products-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Fournisseur</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Statut</th>
              <th style={{ width: "190px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {produits.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Aucun produit pour le moment.
                </td>
              </tr>
            ) : (
              produits.map((p) => (
                <tr key={p.id}>
                  <td>{p.nom}</td>

                 
                  <td>{p.categorieProduit ?? "-"}</td>

                 
                  <td>{p.fournisseur?.nom ?? "-"}</td>

                 
                  <td>{p.prixVente ?? "-"}</td>

                 
                  <td>{p.quantite_dispo ?? "-"}</td>

                  <td>{p.statut ?? "-"}</td>

                  <td>
                    <button
                      className="btn-small btn-edit"
                      onClick={() => handleVoirProduit(p.id)}
                    >
                      Voir / Modifier
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProduitsMagasinier;
