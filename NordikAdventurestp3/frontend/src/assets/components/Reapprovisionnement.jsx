import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchReapproProduits,
  selectReapproItems,
  selectReapproLoading,
  selectReapproError,
} from "../../store/reapprovisionnementSlice";

import "../../styles/Reapprovisionnement.css"; 

export default function Reapprovisionnement() {
  const dispatch = useDispatch();

  
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const isAllowed = role === "magasinier" || role === "comptable";

  const itemsRaw = useSelector(selectReapproItems);
  const loading = useSelector(selectReapproLoading);
  const error = useSelector(selectReapproError);

  const items = useMemo(
    () => (Array.isArray(itemsRaw) ? itemsRaw : []),
    [itemsRaw]
  );

  useEffect(() => {
    if (isAllowed) dispatch(fetchReapproProduits());
  }, [dispatch, isAllowed]);

  if (!isAllowed) {
    return (
      <main className="reappro-page">
        <h1 className="reappro-title">Réapprovisionnement</h1>
        <p className="reappro-error">Accès refusé.</p>
      </main>
    );
  }

  return (
    <main className="reappro-page">
      <h1 className="reappro-title">Réapprovisionnement</h1>

      {loading && <p className="reappro-loading">Chargement…</p>}
      {error && <div className="reappro-error">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="reappro-empty">Aucun produit sous le seuil ✅</div>
      )}

      {!loading && !error && items.length > 0 && (
        <table className="reappro-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th style={{ textAlign: "center" }}>Stock</th>
              <th style={{ textAlign: "center" }}>Seuil</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const stock = Number(p?.quantite_dispo ?? 0);
              const seuil = Number(p?.seuilReapprovisionnement ?? 0);
              const danger = stock <= seuil;

              return (
                <tr key={p.id}>
                  <td>{p.nom}</td>
                  <td
                    style={{ textAlign: "center" }}
                    className={danger ? "reappro-stock-danger" : ""}
                  >
                    {stock}
                  </td>
                  <td style={{ textAlign: "center" }}>{seuil}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
