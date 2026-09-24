// src/pages/financier/AccueilFinancier.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDashboardFinancier,
  selectDashboardFinancierData,
  selectDashboardFinancierLoading,
  selectDashboardFinancierError,
} from "../../store/dashboardFinancierSlice";

import ReapproAlerte from "../../assets/components/ReapproAlerte";
import "../../styles/AccueilFinancier.css";


function AccueilFinancier() {
  const dispatch = useDispatch();
  const username = localStorage.getItem("nom") || "Financier";

  const data = useSelector(selectDashboardFinancierData);
  const loading = useSelector(selectDashboardFinancierLoading);
  const error = useSelector(selectDashboardFinancierError);

  useEffect(() => {
    dispatch(fetchDashboardFinancier());
  }, [dispatch]);

  // ✅ Valeurs API
  const nbVentes = data?.nbVentes ?? 0;
  const totalRevenus = data?.totalRevenus ?? 0;

  // ✅ NOUVEAU : statutsCommandes est un objet
  // ex: { PAYEE: 13, PREPARATION: 1, EXPEDIEE: 2, FERMEE: 2 }
  const statuts = data?.statutsCommandes || {};

  // ✅ Satisfaction moyenne
  const satisfaction = data?.satisfactionMoyenne ?? 0;

  return (
    <div className="financier-page">
      <h1>Bienvenue {username}</h1>

      <div className="financier-intro">
        <p>
          Voici votre tableau de bord Financier : ventes, revenus, satisfaction
          et statuts.
        </p>
      </div>

      {/* (Optionnel) Alerte réapprovisionnement */}
      <ReapproAlerte />

      {loading && <p>Chargement des indicateurs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && data && (
        <div className="dashboard-grid">
          {/* ✅ KPI 1 */}
          <div className="dash-card">
            <h2>Nombre de ventes</h2>
            <p className="dash-value">{nbVentes}</p>
            <p className="dash-label">Factures payées</p>
          </div>

          {/* ✅ KPI 2 */}
          <div className="dash-card">
            <h2>Total des revenus</h2>
            <p className="dash-value">{Number(totalRevenus).toFixed(2)} $</p>
            <p className="dash-label">Somme des factures payées</p>
          </div>

          {/* ✅ KPI 3 */}
          <div className="dash-card kpi-alert">
            <h2>Satisfaction client</h2>
            <p className="dash-value">{Number(satisfaction).toFixed(2)} / 5</p>
            <p className="dash-label">Moyenne des avis</p>
          </div>

          {/* ✅ KPI 4 */}
          <div className="dash-card">
            <h2>Commandes (statuts)</h2>

            <ul className="dash-status-list">
              {Object.keys(statuts).length === 0 ? (
                <li>Aucun statut</li>
              ) : (
                Object.entries(statuts).map(([k, v]) => (
                  <li key={k}>
                    {k} : <strong>{v}</strong>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccueilFinancier;
