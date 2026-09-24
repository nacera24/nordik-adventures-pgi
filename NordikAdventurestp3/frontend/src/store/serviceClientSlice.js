import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

//  liste clients
export const fetchClientsCRM = createAsyncThunk(
  "serviceClient/fetchClientsCRM",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/crm/clients/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Erreur chargement clients CRM");
    }
  }
);

//  détail client + activites
export const fetchClientCRMDetail = createAsyncThunk(
  "serviceClient/fetchClientCRMDetail",
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/crm/clients/${clientId}/`);
      return res.data; // { client, activites }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Erreur chargement détails client");
    }
  }
);

//  ajouter activité 
export const addActiviteCRM = createAsyncThunk(
  "serviceClient/addActiviteCRM",
  async ({ clientId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/crm/clients/${clientId}/activites/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // activite créée
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Erreur ajout activité");
    }
  }
);

const serviceClientSlice = createSlice({
  name: "serviceClient",
  initialState: {
    clients: [],
    selectedClient: null,
    activites: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCRM(state) {
      state.selectedClient = null;
      state.activites = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientsCRM.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchClientsCRM.fulfilled, (state, action) => {
        state.loading = false; state.clients = action.payload;
      })
      .addCase(fetchClientsCRM.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })

      .addCase(fetchClientCRMDetail.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchClientCRMDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClient = action.payload.client;
        state.activites = action.payload.activites;
      })
      .addCase(fetchClientCRMDetail.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })

      .addCase(addActiviteCRM.fulfilled, (state, action) => {
        
        state.activites = [action.payload, ...state.activites];
      });
  },
});

export const { clearCRM } = serviceClientSlice.actions;
export default serviceClientSlice.reducer;

export const selectClientsCRM = (s) => s.serviceClient.clients;
export const selectSelectedClientCRM = (s) => s.serviceClient.selectedClient;
export const selectActivitesCRM = (s) => s.serviceClient.activites;
export const selectServiceClientLoading = (s) => s.serviceClient.loading;
export const selectServiceClientError = (s) => s.serviceClient.error;
