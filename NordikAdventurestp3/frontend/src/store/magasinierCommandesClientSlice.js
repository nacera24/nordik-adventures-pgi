import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

//  Charger commandes clients à traiter
export const fetchCommandesClients = createAsyncThunk(
  "magasinierCommandesClient/fetchCommandesClients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/magasinier/commandes-clients/");
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors du chargement des commandes clients.";
      return rejectWithValue(message);
    }
  }
);

// Changer statut commande client
export const updateStatutCommandeClient = createAsyncThunk(
  "magasinierCommandesClient/updateStatutCommandeClient",
  async ({ commandeId, statut }, { rejectWithValue }) => {
    try {
      if (!commandeId) throw new Error("commandeId manquant");
      if (!statut) throw new Error("statut manquant");

      const res = await api.patch(
        `/magasinier/commandes-clients/${commandeId}/statut/`,
        { statut }
      );

   
      return { commandeId, statut, server: res.data };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la mise à jour du statut.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  commandes: [],
  loading: false,
  error: null,
  updatingId: null,
  updatingError: null,
};

const magasinierCommandesClientSlice = createSlice({
  name: "magasinierCommandesClient",
  initialState,
  reducers: {
    clearMagasinierCommandesError: (state) => {
      state.error = null;
      state.updatingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCommandesClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommandesClients.fulfilled, (state, action) => {
        state.loading = false;
        state.commandes = action.payload || [];
      })
      .addCase(fetchCommandesClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update statut
      .addCase(updateStatutCommandeClient.pending, (state, action) => {
        state.updatingId = action.meta.arg?.commandeId || null;
        state.updatingError = null;
      })
      .addCase(updateStatutCommandeClient.fulfilled, (state, action) => {
        state.updatingId = null;

        const { commandeId, statut } = action.payload;
        const idx = state.commandes.findIndex((c) => String(c.id) === String(commandeId));
        if (idx !== -1) {
          state.commandes[idx] = { ...state.commandes[idx], statut };
        }
      })
      .addCase(updateStatutCommandeClient.rejected, (state, action) => {
        state.updatingId = null;
        state.updatingError = action.payload;
      });
  },
});

export const { clearMagasinierCommandesError } =
  magasinierCommandesClientSlice.actions;

export const selectCmdClients = (state) => state.magasinierCommandesClient.commandes;
export const selectCmdClientsLoading = (state) => state.magasinierCommandesClient.loading;
export const selectCmdClientsError = (state) => state.magasinierCommandesClient.error;
export const selectCmdClientsUpdatingId = (state) => state.magasinierCommandesClient.updatingId;
export const selectCmdClientsUpdatingError = (state) =>
  state.magasinierCommandesClient.updatingError;

export default magasinierCommandesClientSlice.reducer;
