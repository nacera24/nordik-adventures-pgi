import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/axios";

/**
 * Inscription CLIENT uniquement
 * username = email côté frontend
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, password, nom }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register-client/", {
        username,
        password,
        nom,
      });
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de l’inscription.";
      return rejectWithValue(message);
    }
  }
);

/**
 * Connexion (client ou employé)
 * type = "client" ou "employe"
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password, type }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
        type,
      });
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Erreur lors de la connexion.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  registered: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.registered = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.registered = false;

      //  nettoyage localStorage
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("userId"); 
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registered = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registered = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Inscription échouée.";
        state.registered = false;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { token, user } = action.payload;

        state.user = user || null;
        state.token = token || null;

        //  stocker username/role/token
        if (user?.username) localStorage.setItem("username", user.username);
        if (user?.role) localStorage.setItem("role", user.role);
        if (token) localStorage.setItem("token", token);

        //  stocker id utilisateur (client ou employé)
        if (user?.id != null) {
          localStorage.setItem("userId", String(user.id));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Connexion échouée.";
      });
  },
});

export const selectAuth = (state) => state.auth;
export const { clearAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
