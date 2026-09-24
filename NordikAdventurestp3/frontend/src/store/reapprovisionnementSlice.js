import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

// GET /api/produits/reapprovisionnement/
export const fetchReapproProduits = createAsyncThunk(
  "reapprovisionnement/fetchReapproProduits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/produits/reapprovisionnement/");
      return res.data; // tableau de produits
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Erreur lors du chargement des alertes de réapprovisionnement.";
      return rejectWithValue(msg);
    }
  }
);

const reapprovisionnementSlice = createSlice({
  name: "reapprovisionnement",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReapproError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReapproProduits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReapproProduits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchReapproProduits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erreur inconnue.";
      });
  },
});

export const { clearReapproError } = reapprovisionnementSlice.actions;


export const selectReapproItems = (state) =>
  state?.reapprovisionnement?.items || [];
export const selectReapproLoading = (state) =>
  state?.reapprovisionnement?.loading || false;
export const selectReapproError = (state) =>
  state?.reapprovisionnement?.error || null;

export default reapprovisionnementSlice.reducer;
