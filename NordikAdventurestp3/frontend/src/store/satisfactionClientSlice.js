import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

/**
 * POST /api/satisfactions/
 * Backend attend: { client, commande, note, commentaire }
 */
export const envoyerSatisfaction = createAsyncThunk(
  "satisfaction/envoyerSatisfaction",
  async ({ clientId, commandeId, note, commentaire }, { rejectWithValue }) => {
    try {
      const res = await api.post("/satisfactions/", {
        client: clientId,
        commande: commandeId,
        note,
        commentaire: commentaire || null,
      });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Erreur lors de l'envoi de la satisfaction.";
      return rejectWithValue(message);
    }
  }
);

const satisfactionSlice = createSlice({
  name: "satisfaction",
  initialState: {
    loading: false,
    error: null,
    lastSatisfaction: null,
  },
  reducers: {
    clearSatisfactionState: (state) => {
      state.loading = false;
      state.error = null;
      state.lastSatisfaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(envoyerSatisfaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(envoyerSatisfaction.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSatisfaction = action.payload;
      })
      .addCase(envoyerSatisfaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSatisfactionState } = satisfactionSlice.actions;
export default satisfactionSlice.reducer;
