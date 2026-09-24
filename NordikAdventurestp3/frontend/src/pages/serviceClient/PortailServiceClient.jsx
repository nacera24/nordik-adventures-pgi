import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchClientsCRM,
  fetchClientCRMDetail,
  addActiviteCRM,
  selectClientsCRM,
  selectSelectedClientCRM,
  selectActivitesCRM,
  selectServiceClientLoading,
  selectServiceClientError,
} from "../../store/serviceClientSlice";

import "../../styles/ServiceClient.css";

export default function PortailServiceClient() {
  const dispatch = useDispatch();
  const clients = useSelector(selectClientsCRM);
  const client = useSelector(selectSelectedClientCRM);
  const activites = useSelector(selectActivitesCRM);
  const loading = useSelector(selectServiceClientLoading);
  const error = useSelector(selectServiceClientError);

  const [selectedId, setSelectedId] = useState(null);

  // form ajout activité
  const [type, setType] = useState("NOTE");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchClientsCRM());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId) dispatch(fetchClientCRMDetail(selectedId));
  }, [dispatch, selectedId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedId) return;

    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);

    const employeId = localStorage.getItem("userId"); 
    if (employeId) formData.append("employe_id", employeId);

    if (file) formData.append("fichier", file);

    await dispatch(addActiviteCRM({ clientId: selectedId, formData }));
    setDescription("");
    setFile(null);
  };

  return (
    <div className="sc-page">
      <h1>Service à la clientèle (CRM)</h1>
      <p className="sc-subtitle">Historique des actions clients + ajout manuel (appel, courriel, PDF...)</p>

      {loading && <p>Chargement...</p>}
      {error && <p className="sc-error">{error}</p>}

      <div className="sc-grid">
        {/* Colonne gauche : clients */}
        <div className="sc-card">
          <h2>Clients</h2>

          <select
            className="sc-select"
            value={selectedId || ""}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Sélectionner un client --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} — {c.statut}
              </option>
            ))}
          </select>

          {client && (
            <div className="sc-client-info">
              <p><strong>Nom :</strong> {client.nom}</p>
              <p><strong>Email :</strong> {client.courriel}</p>
              <p><strong>Statut :</strong> {client.statut}</p>
              <p><strong>Dernière activité :</strong> {client.derniere_activite || "N/A"}</p>
            </div>
          )}
        </div>

        {/* Colonne droite : historique + ajout */}
        <div className="sc-card">
          <h2>Historique</h2>

          {!client ? (
            <p>Sélectionne un client pour voir son historique.</p>
          ) : (
            <>
              {/* Form ajout */}
              <form className="sc-form" onSubmit={handleAdd}>
                <div className="sc-row">
                  <label>Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="NOTE">NOTE</option>
                    <option value="APPEL">APPEL</option>
                    <option value="COURRIEL">COURRIEL</option>
                    <option value="PDF">PDF</option>
                    <option value="COMMANDE">COMMANDE</option>
                    <option value="VISITE_PAGE">VISITE_PAGE</option>
                    <option value="VISITE_SITE">VISITE_SITE</option>
                  </select>
                </div>

                <div className="sc-row">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Résumé d’appel, contenu d’un courriel, note, etc."
                    required
                  />
                </div>

                <div className="sc-row">
                  <label>Document (optionnel)</label>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                <button className="sc-btn" type="submit">
                  Ajouter à l’historique
                </button>
              </form>

              {/* Tableau activités */}
              <div className="sc-table-wrap">
                {activites.length === 0 ? (
                  <p>Aucune activité.</p>
                ) : (
                  <table className="sc-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Fichier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activites.map((a) => (
                        
                        <tr key={a.id}>
                          <td>{a.dateActivite}</td>
                          <td>{a.type}</td>
                          <td>{a.description}</td>
                          <td>
                          {a.fichier ? (
                            <a
                              href={`http://localhost:8000${a.fichier}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Voir
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
