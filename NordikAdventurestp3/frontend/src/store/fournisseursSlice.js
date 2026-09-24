import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

// GET fournisseurs 
export const fetchFournisseurs = createAsyncThunk(
  "fournisseurs/fetchFournisseurs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/fournisseurs/");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          "Erreur lors du chargement des fournisseurs."
      );
    }
  }
);

// POST fournisseur
export const addFournisseur = createAsyncThunk(
  "fournisseurs/addFournisseur",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/fournisseurs/creer/", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          "Erreur lors de l'ajout du fournisseur."
      );
    }
  }
);

// PUT/PATCH fournisseur 
export const updateFournisseur = createAsyncThunk(
  "fournisseurs/updateFournisseur",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/fournisseurs/${id}/modifier/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          "Erreur lors de la modification du fournisseur."
      );
    }
  }
);

const fournisseursSlice = createSlice({
  name: "fournisseurs",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFournisseurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFournisseurs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchFournisseurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFournisseur.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addFournisseur.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateFournisseur.fulfilled, (state, action) => {
        const idx = state.items.findIndex((f) => f.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateFournisseur.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default fournisseursSlice.reducer;
export const selectFournisseurs = (state) => state.fournisseurs.items;
