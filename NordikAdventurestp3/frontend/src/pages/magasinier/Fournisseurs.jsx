import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFournisseurs,
  addFournisseur,
  updateFournisseur,
} from "../../store/fournisseursSlice";
import "../../styles/Fournisseurs.css";

function Fournisseurs() {
  const dispatch = useDispatch();
  const { items: fournisseurs, loading, error } = useSelector(
    (state) => state.fournisseurs
  );

  // état pour le formulaire
  const [nom, setNom] = useState("");
  const [editingId, setEditingId] = useState(null); 

  useEffect(() => {
    dispatch(fetchFournisseurs());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nom.trim()) return;

    if (editingId) {
      // mode édition
      dispatch(updateFournisseur({ id: editingId, data: { nom } }));
    } else {
      // mode ajout
      dispatch(addFournisseur({ nom }));
    }

    setNom("");
    setEditingId(null);
  };

  const handleEditClick = (fournisseur) => {
    setEditingId(fournisseur.id);
    setNom(fournisseur.nom);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNom("");
  };

  return (
    <div className="fournisseurs-page">
      <div className="fournisseurs-header">
        <h2>Fournisseurs</h2>

      </div>

      <div className="fournisseurs-content">
        {/* TABLEAU */}
        <div className="fournisseurs-table-wrapper">
          {loading && <p>Chargement des fournisseurs...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && (
            <table className="fournisseurs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom du fournisseur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fournisseurs.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      Aucun fournisseur pour le moment.
                    </td>
                  </tr>
                ) : (
                  fournisseurs.map((f) => (
                    <tr key={f.id}>
                      <td>{f.id}</td>
                      <td>{f.nom}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(f)}
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* FORMULAIRE à droite */}
        <div className="fournisseurs-form-wrapper">
          <h3>{editingId ? "Modifier le fournisseur" : "Ajouter un fournisseur"}</h3>

          <form onSubmit={handleSubmit} className="fournisseurs-form">
            <label>
              Nom du fournisseur
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Nordik Equipements Inc."
              />
            </label>

            <div className="form-buttons">
              <button type="submit" className="btn-save">
                {editingId ? "Enregistrer les modifications" : "Ajouter"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Fournisseurs;
