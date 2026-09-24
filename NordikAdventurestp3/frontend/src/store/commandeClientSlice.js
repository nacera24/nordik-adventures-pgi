
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

// Liste des commandes d’un client
// GET /commandes-client/client/<client_id>/
export const fetchCommandesClient = createAsyncThunk(
  "commandeClient/fetchCommandesClient",
  async (clientId, { rejectWithValue }) => {
    try {
      if (!clientId) throw new Error("clientId manquant.");
      const res = await api.get(`/commandes-client/client/${clientId}/`);
      return res.data; 
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des commandes.";
      return rejectWithValue(message);
    }
  }
);

// Détail d’une commande
// GET /commandes-client/<commande_id>/
export const fetchCommandeClientDetail = createAsyncThunk(
  "commandeClient/fetchCommandeClientDetail",
  async (commandeId, { rejectWithValue }) => {
    try {
      if (!commandeId) throw new Error("commandeId manquant.");
      const res = await api.get(`/commandes-client/${commandeId}/`);
      return res.data; // objet commande
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement du détail de la commande.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  // liste
  commandes: [],
  loadingListe: false,
  errorListe: null,

  // détail
  current: null,
  loading: false,
  error: null,
};

const commandeClientSlice = createSlice({
  name: "commandeClient",
  initialState,
  reducers: {
    clearCommandesClient: (state) => {
      state.commandes = [];
      state.loadingListe = false;
      state.errorListe = null;
    },
    clearCommandeCourante: (state) => {
      state.current = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== LISTE =====
      .addCase(fetchCommandesClient.pending, (state) => {
        state.loadingListe = true;
        state.errorListe = null;
      })
      .addCase(fetchCommandesClient.fulfilled, (state, action) => {
        state.loadingListe = false;
        state.commandes = action.payload || [];
      })
      .addCase(fetchCommandesClient.rejected, (state, action) => {
        state.loadingListe = false;
        state.errorListe = action.payload;
      })

      // ===== DETAIL =====
      .addCase(fetchCommandeClientDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommandeClientDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(fetchCommandeClientDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommandesClient, clearCommandeCourante } =
  commandeClientSlice.actions;


export const selectCommandesClient = (state) => state.commandeClient.commandes;
export const selectCommandesClientLoading = (state) =>
  state.commandeClient.loadingListe;
export const selectCommandesClientError = (state) =>
  state.commandeClient.errorListe;


export const selectCommandeClientCourante = (state) =>
  state.commandeClient.current;
export const selectCommandeClientLoading = (state) => state.commandeClient.loading;
export const selectCommandeClientError = (state) => state.commandeClient.error;

export default commandeClientSlice.reducer;
