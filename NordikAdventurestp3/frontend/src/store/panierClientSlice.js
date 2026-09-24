
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

/**
 * GET /api/paniers/client/{userId}/
 */
export const fetchPanier = createAsyncThunk(
  "panierClient/fetchPanier",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("userId manquant pour charger le panier.");
      const res = await api.get(`/paniers/client/${userId}/`);
      return res.data; // { id_panier, items: [...] }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors du chargement du panier.";
      return rejectWithValue(message);
    }
  }
);

/**
 * POST /api/paniers/client/{userId}/items/
 */
export const addAuPanier = createAsyncThunk(
  "panierClient/addAuPanier",
  async ({ userId, produitId, quantite = 1 }, { rejectWithValue }) => {
    try {
      if (!userId) throw new Error("userId manquant pour ajouter au panier.");
      if (!produitId) throw new Error("produitId manquant pour ajouter au panier.");

      const body = { produit_id: produitId, quantite };
      const res = await api.post(`/paniers/client/${userId}/items/`, body);
      return res.data; // { id_panier, items: [...] }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de l'ajout au panier.";
      return rejectWithValue(message);
    }
  }
);

/**
 * PATCH /api/paniers/items/{itemId}/
 */
export const updateQuantiteItem = createAsyncThunk(
  "panierClient/updateQuantiteItem",
  async ({ itemId, quantite }, { rejectWithValue }) => {
    try {
      if (!itemId) throw new Error("itemId manquant pour la mise à jour de la quantité.");
      const res = await api.patch(`/paniers/items/${itemId}/`, { quantite });
      return res.data; // { id_panier, items: [...] }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de la mise à jour de la quantité.";
      return rejectWithValue(message);
    }
  }
);

/**
 * DELETE /api/paniers/items/{itemId}/
 */
export const removeItemPanier = createAsyncThunk(
  "panierClient/removeItemPanier",
  async (itemId, { rejectWithValue }) => {
    try {
      if (!itemId) throw new Error("itemId manquant pour la suppression.");
      const res = await api.delete(`/paniers/items/${itemId}/`);
      return res.data; // { id_panier, items: [...] }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de la suppression de l'article du panier.";
      return rejectWithValue(message);
    }
  }
);

/**
 * DELETE /api/paniers/{id_panier}/items/
 */
export const viderPanier = createAsyncThunk(
  "panierClient/viderPanier",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { id_panier } = getState().panierClient;
      if (!id_panier) throw new Error("Aucun panier à vider (id_panier manquant).");
      const res = await api.delete(`/paniers/${id_panier}/items/`);
      return res.data; // { id_panier, items: [] }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors du vidage du panier.";
      return rejectWithValue(message);
    }
  }
);

//  State
const initialState = {
  id_panier: null,
  items: [],
  loading: false,
  error: null,
};

const panierClientSlice = createSlice({
  name: "panierClient",
  initialState,
  reducers: {
    clearPanierError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchPanier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPanier.fulfilled, (state, action) => {
        state.loading = false;
        state.id_panier = action.payload.id_panier ?? null;
        state.items = action.payload.items || [];
      })
      .addCase(fetchPanier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ADD
    builder
      .addCase(addAuPanier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAuPanier.fulfilled, (state, action) => {
        state.loading = false;
        state.id_panier = action.payload.id_panier ?? state.id_panier;
        state.items = action.payload.items || state.items;
      })
      .addCase(addAuPanier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE QTE
    builder
      .addCase(updateQuantiteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantiteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.id_panier = action.payload.id_panier ?? state.id_panier;
        state.items = action.payload.items || state.items;
      })
      .addCase(updateQuantiteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // REMOVE
    builder
      .addCase(removeItemPanier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemPanier.fulfilled, (state, action) => {
        state.loading = false;
        state.id_panier = action.payload.id_panier ?? state.id_panier;
        state.items = action.payload.items || [];
      })
      .addCase(removeItemPanier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // VIDER
    builder
      .addCase(viderPanier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viderPanier.fulfilled, (state, action) => {
        state.loading = false;
        state.id_panier = action.payload.id_panier ?? state.id_panier;
        state.items = action.payload.items || [];
      })
      .addCase(viderPanier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPanierError } = panierClientSlice.actions;

// Selectors
export const selectPanier = (state) => state.panierClient;
export const selectPanierItems = (state) => state.panierClient.items;
export const selectPanierLoading = (state) => state.panierClient.loading;
export const selectPanierError = (state) => state.panierClient.error;


export const selectPanierTotal = (state) =>
  state.panierClient.items.reduce((sum, item) => {
    const price = Number(item.produit?.prixVente ?? 0);
    return sum + price * (item.quantite || 0);
  }, 0);

export default panierClientSlice.reducer;
