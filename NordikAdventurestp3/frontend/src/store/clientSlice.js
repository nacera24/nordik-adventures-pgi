import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

export const fetchProfilClient = createAsyncThunk(
  "client/fetchProfilClient",
  async (_, { rejectWithValue }) => {
    try {
      const clientId = localStorage.getItem("userId");

      if (!clientId) {
        throw new Error("Client ID introuvable. Reconnecte-toi.");
      }

      //  profil par id
      const res = await api.get(`/clients/${clientId}/`);
      return res.data; // { id, nom, username }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Erreur lors du chargement du profil client.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  profil: {
    data: null,
    loading: false,
    error: null,
  },
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClient(state) {
      state.profil = { data: null, loading: false, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfilClient.pending, (state) => {
        state.profil.loading = true;
        state.profil.error = null;
      })
      .addCase(fetchProfilClient.fulfilled, (state, action) => {
        state.profil.loading = false;
        state.profil.data = action.payload;
      })
      .addCase(fetchProfilClient.rejected, (state, action) => {
        state.profil.loading = false;
        state.profil.error = action.payload || "Erreur inconnue.";
      });
  },
});

export const { clearClient } = clientSlice.actions;
export const selectClientProfil = (state) => state.client.profil;
export default clientSlice.reducer;
