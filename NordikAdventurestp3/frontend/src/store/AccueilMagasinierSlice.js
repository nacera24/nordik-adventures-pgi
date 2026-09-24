// src/store/AccueilMagasinierSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";   

/**
 * Récupérer les infos du tableau de bord magasinier 
 */
export const fetchDashboard = createAsyncThunk(
  "magasinier/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
     
      const res = await api.get("/magasinier/dashboard/");
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors du chargement du tableau de bord.";
      return rejectWithValue(message);
    }
  }
);

const AccueilMagasinierSlice = createSlice({
  name: "magasinier",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const selectDashboard = (state) => state.magasinier.data;
export const selectDashboardLoading = (state) => state.magasinier.loading;
export const selectDashboardError = (state) => state.magasinier.error;

export default AccueilMagasinierSlice.reducer;
