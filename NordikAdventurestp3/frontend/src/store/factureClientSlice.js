
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

/**
 *  Payer une commande client
 * POST /commandes-client/<client_id>/payer/
 * Le backend crée la facture depuis le panier + vide le panier (backend)
 */
export const payerCommandeClient = createAsyncThunk(
  "factureClient/payerCommandeClient",
  async ({ clientId, mode = "carte" }, { rejectWithValue }) => {
    try {
      if (!clientId) throw new Error("clientId manquant pour payer.");

      const res = await api.post(`/commandes-client/${clientId}/payer/`, { mode });
      return res.data; // facture créée
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du paiement.";
      return rejectWithValue(message);
    }
  }
);

/**
 *  Récupérer toutes les factures d'un client
 * GET /factures/client/<clientId>/
 */
export const fetchFacturesClient = createAsyncThunk(
  "factureClient/fetchFacturesClient",
  async (clientId, { rejectWithValue }) => {
    try {
      if (!clientId) throw new Error("clientId manquant.");

      const res = await api.get(`/factures/client/${clientId}/`);
      return res.data; // tableau de factures
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des factures du client.";
      return rejectWithValue(message);
    }
  }
);

/**
 *  Récupérer UNE facture par ID
 * GET /factures/<factureId>/
 */
export const fetchFactureClient = createAsyncThunk(
  "factureClient/fetchFactureClient",
  async (factureId, { rejectWithValue }) => {
    try {
      if (!factureId) throw new Error("factureId manquant.");

      const res = await api.get(`/factures/${factureId}/`);
      return res.data; // facture détail
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement de la facture.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  current: null,
  loading: false,
  error: null,

  facturesClient: [],
  loadingListe: false,
  errorListe: null,
};

const factureClientSlice = createSlice({
  name: "factureClient",
  initialState,
  reducers: {
    clearFacture: (state) => {
      state.current = null;
      state.error = null;
    },
    clearFacturesClient: (state) => {
      state.facturesClient = [];
      state.loadingListe = false;
      state.errorListe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  payerCommandeClient
      .addCase(payerCommandeClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payerCommandeClient.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;

        
        if (action.payload?.id) {
          const existe = state.facturesClient.some((f) => f.id === action.payload.id);
          if (!existe) state.facturesClient.unshift(action.payload);
        }
      })
      .addCase(payerCommandeClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // liste factures
      .addCase(fetchFacturesClient.pending, (state) => {
        state.loadingListe = true;
        state.errorListe = null;
      })
      .addCase(fetchFacturesClient.fulfilled, (state, action) => {
        state.loadingListe = false;
        state.facturesClient = action.payload || [];
      })
      .addCase(fetchFacturesClient.rejected, (state, action) => {
        state.loadingListe = false;
        state.errorListe = action.payload;
      })

      // détail facture
      .addCase(fetchFactureClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFactureClient.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(fetchFactureClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFacture, clearFacturesClient } = factureClientSlice.actions;

export const selectFactureCourante = (state) => state.factureClient.current;
export const selectFactureLoading = (state) => state.factureClient.loading;
export const selectFactureError = (state) => state.factureClient.error;

export const selectFacturesClient = (state) => state.factureClient.facturesClient;
export const selectFacturesClientLoading = (state) => state.factureClient.loadingListe;
export const selectFacturesClientError = (state) => state.factureClient.errorListe;

export default factureClientSlice.reducer;
