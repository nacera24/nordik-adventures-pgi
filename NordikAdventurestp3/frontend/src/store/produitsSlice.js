import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

/**
 * Récupérer la liste des produits
 */
export const fetchProduits = createAsyncThunk(
  "produits/fetchProduits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/produits/");
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors du chargement des produits.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Récupérer un produit par id
 */
export const fetchProduitById = createAsyncThunk(
  "produits/fetchProduitById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/produits/${id}/`);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors du chargement du produit.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Ajouter un produit avec image
 */
export const addProduit = createAsyncThunk(
  "produits/addProduit",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/produits/creer/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de la création du produit.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Mettre à jour un produit
 */
export const updateProduit = createAsyncThunk(
  "produits/updateProduit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/produits/${id}/modifier/`, data);
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de la mise à jour du produit.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Supprimer un produit
 */
export const deleteProduit = createAsyncThunk(
  "produits/deleteProduit",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/produits/${id}/effacer/`);
      return id;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de la suppression du produit.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Produits par fournisseur
 */
export const fetchProduitsParFournisseur = createAsyncThunk(
  "produits/fetchProduitsParFournisseur",
  async (idFournisseur, { rejectWithValue }) => {
    try {
      const res = await api.get(`/fournisseurs/${idFournisseur}/produits/`);
      return res.data || [];
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors du chargement des produits du fournisseur.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

const produitsSlice = createSlice({
  name: "produits",
  initialState,
  reducers: {
    clearProduitsError: (state) => {
      state.error = null;
    },
    clearCurrentProduit: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LISTE
      .addCase(fetchProduits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchProduits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Impossible de charger les produits.";
      })

      // DÉTAIL
      .addCase(fetchProduitById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchProduitById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProduitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Impossible de charger le produit.";
      })

      // AJOUT
      .addCase(addProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduit.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(addProduit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Création échouée.";
      })

      // UPDATE
      .addCase(updateProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduit.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        state.items = state.items.map((p) =>
          (p.id ?? p.id_produit) === (updated.id ?? updated.id_produit)
            ? updated
            : p
        );

        state.current = updated;
      })
      .addCase(updateProduit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Mise à jour échouée.";
      })

      // DELETE
      .addCase(deleteProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduit.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        state.items = state.items.filter((p) => (p.id ?? p.id_produit) !== id);

        if (state.current && (state.current.id ?? state.current.id_produit) === id) {
          state.current = null;
        }
      })
      .addCase(deleteProduit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Suppression échouée.";
      })

      //  PRODUITS PAR FOURNISSEUR
      .addCase(fetchProduitsParFournisseur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduitsParFournisseur.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchProduitsParFournisseur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Impossible de charger les produits du fournisseur.";
      });
  },
});

export const { clearProduitsError, clearCurrentProduit } = produitsSlice.actions;

export const selectProduits = (state) => state.produits.items;
export const selectProduitCourant = (state) => state.produits.current;
export const selectProduitsLoading = (state) => state.produits.loading;
export const selectProduitsError = (state) => state.produits.error;

export default produitsSlice.reducer;
