
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

/**
 * POST /commandes-achat/
 * payload = { fournisseurId: number, lignes: [{ produitId, quantite }] }
 */
export const creerCommandeAchat = createAsyncThunk(
  "commandeAchat/creerCommandeAchat",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/commandes-achat/", payload);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors de la création de la commande d’achat.";
      return rejectWithValue(message);
    }
  }
);

/**
 * GET /commandes-achat/liste/
 */
export const fetchCommandesAchat = createAsyncThunk(
  "commandeAchat/fetchCommandesAchat",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/commandes-achat/liste/");
      return res.data || [];
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors du chargement des commandes d’achat.";
      return rejectWithValue(message);
    }
  }
);

/**
 * GET /commandes-achat/<id>/
 */
export const fetchCommandeAchatById = createAsyncThunk(
  "commandeAchat/fetchCommandeAchatById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/commandes-achat/${id}/`);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors du chargement de la commande.";
      return rejectWithValue(message);
    }
  }
);

/**
 * POST /commandes-achat/<id>/receptionner/
 */
export const receptionnerCommandeAchat = createAsyncThunk(
  "commandeAchat/receptionnerCommandeAchat",
  async (commandeId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/commandes-achat/${commandeId}/receptionner/`);
      return { commandeId, data: res.data };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors de la réception de la commande.";
      return rejectWithValue(message);
    }
  }
);

/**
 * payload = { commandeId, montant, mode }
 */
export const payerCommandeAchat = createAsyncThunk(
  "commandeAchat/payerCommandeAchat",
  async ({ commandeId, montant, mode }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/commandes-achat/${commandeId}/payer/`, {
        montant,
        mode,
      });
      return res.data; // commande mise à jour (avec paiement)
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors du paiement.";
      return rejectWithValue(message);
    }
  }
);

const commandeAchatSlice = createSlice({
  name: "commandeAchat",
  initialState: {
    items: [], // liste
    byId: {}, // cache par id
    loading: false,
    error: null,
  },
  reducers: {
    clearCommandeAchatError: (state) => {
      state.error = null;
    },
    clearCommandeAchat: (state) => {
      state.items = [];
      state.byId = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ======================
      // CREATE
      // ======================
      .addCase(creerCommandeAchat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(creerCommandeAchat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const created = action.payload;
        if (!created) return;

        const id = Number(created.id);

    
        state.items = state.items.filter((c) => Number(c.id) !== id);
        state.items.unshift(created);

       
        if (!Number.isNaN(id)) state.byId[id] = created;
      })
      .addCase(creerCommandeAchat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // LIST
      // ======================
      .addCase(fetchCommandesAchat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommandesAchat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const list = action.payload || [];
        state.items = list;

      
        list.forEach((c) => {
          if (c?.id != null) state.byId[Number(c.id)] = c;
        });
      })
      .addCase(fetchCommandesAchat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // GET BY ID
      // ======================
      .addCase(fetchCommandeAchatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommandeAchatById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const commande = action.payload;
        if (!commande || commande.id == null) return;

        const id = Number(commande.id);

    
        state.byId[id] = commande;

        
        const idx = state.items.findIndex((c) => Number(c.id) === id);
        if (idx >= 0) state.items[idx] = commande;
        else state.items.unshift(commande);
      })
      .addCase(fetchCommandeAchatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // RECEPTION
      // ======================
      .addCase(receptionnerCommandeAchat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(receptionnerCommandeAchat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const commandeId = Number(action.payload?.commandeId);
        if (Number.isNaN(commandeId)) return;

        state.items = state.items.map((c) =>
          Number(c.id) === commandeId ? { ...c, statut: "RECEPTIONNEE" } : c
        );

        if (state.byId[commandeId]) {
          state.byId[commandeId] = {
            ...state.byId[commandeId],
            statut: "RECEPTIONNEE",
          };
        }
      })
      .addCase(receptionnerCommandeAchat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // PAYER
      // ======================
      .addCase(payerCommandeAchat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payerCommandeAchat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updated = action.payload;
        if (!updated || updated.id == null) return;

        const id = Number(updated.id);

        // cache
        state.byId[id] = updated;

        // liste
        const idx = state.items.findIndex((c) => Number(c.id) === id);
        if (idx >= 0) state.items[idx] = updated;
        else state.items.unshift(updated);
      })
      .addCase(payerCommandeAchat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommandeAchatError, clearCommandeAchat } =
  commandeAchatSlice.actions;

export default commandeAchatSlice.reducer;

// ======================
// SELECTORS
// ======================
export const selectCommandeAchatItems = (state) => state.commandeAchat.items;
export const selectCommandeAchatLoading = (state) => state.commandeAchat.loading;
export const selectCommandeAchatError = (state) => state.commandeAchat.error;


export const selectCommandeAchatById = (id) => (state) =>
  state.commandeAchat.byId[Number(id)];
