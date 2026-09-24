import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/CommandesAchatMagasinier.css";

import {
  fetchCommandesAchat,
  receptionnerCommandeAchat,
  selectCommandeAchatItems,
  selectCommandeAchatLoading,
  selectCommandeAchatError,
} from "../../store/commandeAchatSlice";

// format date 
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function CommandesAchatMagasinier() {
  const dispatch = useDispatch();

  const items = useSelector(selectCommandeAchatItems);
  const loading = useSelector(selectCommandeAchatLoading);
  const error = useSelector(selectCommandeAchatError);

  useEffect(() => {
    dispatch(fetchCommandesAchat());
  }, [dispatch]);

  const refresh = () => dispatch(fetchCommandesAchat());

  const receptionner = async (id) => {
    try {
      await dispatch(receptionnerCommandeAchat(id)).unwrap();
      dispatch(fetchCommandesAchat());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="cam-container">
      <div className="cam-header">
        <h1>Commandes d’achat à recevoir</h1>
        <button className="btn" onClick={refresh}>
          Rafraîchir
        </button>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="err">{error}</p>}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fournisseur</th>
              <th>Date commande</th>
              <th>Date réception</th>
              <th>Total</th>
              <th>Statut commande</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {(items || []).map((c) => {
              const dejaReceptionnee = c.statut === "RECEPTIONNEE";

              return (
                <tr key={c.id}>
                  <td>{c.id}</td>

                  <td>{c.fournisseur?.nom || "-"}</td>

                  <td>{formatDate(c.date_commande)}</td>

                  <td>
                    {c.date_reception
                      ? formatDate(c.date_reception)
                      : "Non reçue"}
                  </td>

                  <td>
                    <b>{Number(c.total ?? 0).toFixed(2)} $</b>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        dejaReceptionnee ? "ok" : "warn"
                      }`}
                    >
                      {c.statut}
                    </span>
                  </td>

                  <td>
                    <button
                      className={`btn ${
                        dejaReceptionnee
                          ? "btn-secondary"
                          : "btn-primary"
                      }`}
                      onClick={() => receptionner(c.id)}
                      disabled={dejaReceptionnee}
                    >
                      {dejaReceptionnee
                        ? "Réceptionnée"
                        : "Réceptionner"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {!loading && (!items || items.length === 0) && (
              <tr>
                <td colSpan="7" className="empty">
                  Aucune commande d’achat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
