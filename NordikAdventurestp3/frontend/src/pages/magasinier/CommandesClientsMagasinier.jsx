import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommandesClients,
  updateStatutCommandeClient,
  selectCmdClients,
  selectCmdClientsLoading,
  selectCmdClientsError,
  selectCmdClientsUpdatingId,
  selectCmdClientsUpdatingError,
} from "../../store/magasinierCommandesClientSlice";
import { selectAuth } from "../../store/authSlice";
import "../../styles/CommandesClientsMagasinier.css";

export default function CommandesClientsMagasinier() {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);
  const role = user?.role || null;

  const commandes = useSelector(selectCmdClients);
  const loading = useSelector(selectCmdClientsLoading);
  const error = useSelector(selectCmdClientsError);
  const updatingId = useSelector(selectCmdClientsUpdatingId);
  const updatingError = useSelector(selectCmdClientsUpdatingError);

  useEffect(() => {
    if (role === "magasinier") {
      dispatch(fetchCommandesClients());
    }
  }, [dispatch, role]);

  const setStatut = (commandeId, statut) => {
    dispatch(updateStatutCommandeClient({ commandeId, statut }))
      .unwrap()
      .then(() => {
        
        dispatch(fetchCommandesClients());
      })
      .catch(() => {});
  };

  if (!user || role !== "magasinier") {
    return (
      <main className="cmdm-page">
        <h1>Commandes clients</h1>
        <p>Accès réservé au magasinier.</p>
      </main>
    );
  }

  return (
    <main className="cmdm-page">
      <h1>Commandes clients</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="cmdm-error">{error}</p>}
      {updatingError && <p className="cmdm-error">{updatingError}</p>}

      {!loading && (!commandes || commandes.length === 0) ? (
        <p>Aucune commande à traiter.</p>
      ) : (
        <div className="cmdm-list">
          {commandes.map((cmd) => {
            const isBusy = String(updatingId) === String(cmd.id);
            const dateStr = cmd.date_creation
              ? new Date(cmd.date_creation).toLocaleString("fr-CA")
              : "—";

            return (
              <section className="cmdm-card" key={cmd.id}>
                <header className="cmdm-header">
                  <div>
                    <h2>Commande #{cmd.id}</h2>
                    <p className="cmdm-meta">
                      Client: <strong>{cmd.client_nom || cmd.client}</strong> •{" "}
                      Date: {dateStr}
                    </p>
                  </div>
                  <div className={`cmdm-badge statut-${(cmd.statut || "").toLowerCase()}`}>
                    {cmd.statut}
                  </div>
                </header>

                {/* lignes */}
                <div className="cmdm-items">
                  <h3>Articles</h3>
                  <table className="cmdm-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Qté</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(cmd.items || []).map((it) => {
                        const pu = Number(it.prix_unitaire ?? 0);
                        const q = Number(it.quantite ?? 0);
                        const tl = Number(it.total_ligne ?? pu * q);

                        return (
                          <tr key={it.id}>
                            <td>{it.nom_produit}</td>
                            <td>{pu.toFixed(2)} $</td>
                            <td>{q}</td>
                            <td>{tl.toFixed(2)} $</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="cmdm-total">
                    Total TTC (facture):{" "}
                    <strong>
                      {cmd.montant_ttc ? Number(cmd.montant_ttc).toFixed(2) : "0.00"} $
                    </strong>
                  </div>
                </div>

                {/* actions */}
                <div className="cmdm-actions">
                  <button
                    disabled={isBusy}
                    className="cmdm-btn"
                    onClick={() => setStatut(cmd.id, "PREPARATION")}
                  >
                    Mettre en préparation
                  </button>

                  <button
                    disabled={isBusy}
                    className="cmdm-btn"
                    onClick={() => setStatut(cmd.id, "EXPEDIEE")}
                  >
                    Marquer expédiée
                  </button>

                  <button
                    disabled={isBusy}
                    className="cmdm-btn danger"
                    onClick={() => setStatut(cmd.id, "FERMEE")}
                  >
                    Fermer
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
