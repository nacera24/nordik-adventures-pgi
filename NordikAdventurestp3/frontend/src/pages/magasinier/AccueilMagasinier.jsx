import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchDashboard,
  selectDashboard,
  selectDashboardLoading,
  selectDashboardError,
} from "../../store/AccueilMagasinierSlice";

import ReapproAlerte from "../../assets/components/ReapproAlerte";
import "../../styles/AccueilMagasinier.css";

function AccueilMagasinier() {
  const username = localStorage.getItem("nom") || "Magasinier";
  const dispatch = useDispatch();

  const dashboard = useSelector(selectDashboard);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="page-container">
        <h1>Bienvenue {username}</h1>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="page-container">
        <h1>Bienvenue {username}</h1>
        <p className="error-text">{error || "Aucune donnée."}</p>
      </div>
    );
  }

  const produitsSousSeuil = dashboard.produitsSousSeuil || [];
  const commandesFournisseur = dashboard.commandesFournisseur || [];
  const commandesClient = dashboard.commandesClient || [];

  return (
    <div className="page-container">
      <h1>Bienvenue {username}</h1>
      <p>Voici votre tableau de bord Magasinier.</p>

      <ReapproAlerte />

      <div className="dashboard-sections">
        {/*  Produits sous le seuil */}
        <section className="section-card">
          <h2>Produits sous le seuil (Action immédiate)</h2>

          {produitsSousSeuil.length === 0 ? (
            <p>Aucune alerte stock.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Fournisseur</th>
                  <th>Stock dispo</th>
                  <th>Stock min</th>
                </tr>
              </thead>
              <tbody>
                {produitsSousSeuil.map((p) => (
                  <tr key={p.id_produit}>
                    <td>{p.nom_produit}</td>
                    <td>{p.fournisseur}</td>
                    <td>{p.stock_dispo}</td>
                    <td>{p.stock_min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/*  Commandes fournisseur */}
        <section className="section-card">
          <h2>Commandes fournisseur récentes</h2>

          {commandesFournisseur.length === 0 ? (
            <p>Aucune commande fournisseur récente.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Fournisseur</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {commandesFournisseur.map((c) => (
                  <tr key={c.id}>
                    <td>{c.date}</td>
                    <td>{c.fournisseur}</td>
                    <td>{c.total}</td>
                    <td>{c.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Commandes client */}
        <section className="section-card">
          <h2>Commandes client récentes</h2>

          {commandesClient.length === 0 ? (
            <p>Aucune commande client récente.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {commandesClient.map((c) => (
                  <tr key={c.id}>
                    <td>{c.date}</td>
                    <td>{c.client}</td>
                    <td>{c.total}</td>
                    <td>{c.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default AccueilMagasinier;
