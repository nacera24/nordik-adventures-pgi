import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

/**
 * Récupérer le tableau de bord financier 
 * Backend retourne :
 * { nbVentes, totalRevenus, nbEnAttente, nbPayees, nbAutres, satisfactionMoyenne }
 */
export const fetchDashboardFinancier = createAsyncThunk(
  "dashboardFinancier/fetchDashboardFinancier",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/financier/dashboard/");
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors du chargement du tableau de bord financier.";
      return rejectWithValue(message);
    }
  }
);

const dashboardFinancierSlice = createSlice({
  name: "dashboardFinancier",
  initialState: {
    loading: false,
    error: null,
    data: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardFinancier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardFinancier.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardFinancier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardFinancierSlice.reducer;

export const selectDashboardFinancierLoading = (state) =>
  state.dashboardFinancier.loading;

export const selectDashboardFinancierError = (state) =>
  state.dashboardFinancier.error;

export const selectDashboardFinancierData = (state) =>
  state.dashboardFinancier.data;
