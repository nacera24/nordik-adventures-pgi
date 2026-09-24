// src/assets/components/ReapproAlerte.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchReapproProduits,
  selectReapproItems,
  selectReapproLoading,
  selectReapproError,
} from "../../store/reapprovisionnementSlice";

export default function ReapproAlerte() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = (localStorage.getItem("role") || "").trim().toLowerCase();
  const isAllowed = role === "magasinier" || role === "comptable";

  const items = useSelector(selectReapproItems);
  const loading = useSelector(selectReapproLoading);
  const error = useSelector(selectReapproError);

  useEffect(() => {
    if (isAllowed) {
      dispatch(fetchReapproProduits());
    }
  }, [dispatch, isAllowed]);

  if (!isAllowed) return null;

  //  route selon le rôle
  const target =
    role === "comptable"
      ? "/portail-financier/reapprovisionnement"
      : "/portail-magasinier/reapprovisionnement";


  if (loading) {
    return (
      <div
        style={{
          padding: 14,
          border: "1px solid #ddd",
          borderRadius: 12,
          background: "#f7f7f7",
          marginBottom: 16,
        }}
      >
        ⏳ Chargement des alertes de réapprovisionnement...
      </div>
    );
  }

  // En cas d'erreur : on affiche le message
  if (error) {
    return (
      <div
        style={{
          padding: 14,
          border: "1px solid #f2b8b5",
          borderRadius: 12,
          background: "#fff0f0",
          marginBottom: 16,
        }}
      >
        ⚠️ Impossible de charger l’alerte réapprovisionnement : <strong>{error}</strong>
      </div>
    );
  }

  const count = Array.isArray(items) ? items.length : 0;
  if (count === 0) return null;

  return (
    <div
      style={{
        padding: 14,
        border: "1px solid #ffe08a",
        borderRadius: 12,
        background: "#fff7db",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
      }}
    >
      <div>
        <strong>⚠️ Réapprovisionnement :</strong> {count} produit(s) sous le seuil.
      </div>

      <button
        onClick={() => navigate(target)}
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: "8px 12px",
          background: "#fff",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Voir
      </button>
    </div>
  );
}
