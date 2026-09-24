import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProduits } from "../store/produitsSlice";
import "../styles/Catalogue.css";

function Catalogue() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: produits, loading, error } = useSelector((state) => state.produits);

  useEffect(() => {
    dispatch(fetchProduits());
  }, [dispatch]);

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="catalogue-page container my-4">
      <h1 className="catalogue-title mb-3">Catalogue des produits</h1>

      <div className="row g-4">
        {produits.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <div className="catalogue-card card h-100 shadow-sm">
              <div className="catalogue-img-wrapper">
                <img
                  src={p.image || "/images/no-image.png"}
                  alt={p.nom}
                  className="card-img-top"
                />
              </div>

              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title catalogue-card-title">{p.nom}</h5>

                <p className="fw-bold catalogue-card-price">{p.prixVente} $</p>

                <button
                  className="btn btn-primary mt-auto catalogue-btn"
                  onClick={() => navigate(`/produits/${p.id}`)}
                >
                  Voir détails
                </button>
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

export default Catalogue;
