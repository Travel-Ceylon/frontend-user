import { create } from "zustand";
import { api } from "../config/api";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null, // stores logged-in user info
  loading: false, // request loading state
  error: null, // error message
  isAuthChecking: true,

  // LOGIN
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post("/api/user/login", credentials);
      if (data) {
        set({ user: data, loading: false });
        return data;
      } else {
        set({ user: null, loading: false });
      }
    } catch (err) {
      set({
        user: null,
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // REGISTER
  register: async (userData) => {
    try {
      const { data } = await api.post("/api/user", userData);
      console.log(data);

      if (data) {
        set({ user: data, loading: false });
        return data;
      } else {
        set({ user: null, loading: false });
      }
    } catch (err) {
      set({
        user: null,
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      const { data } = await api.post("/api/user/logout");
      set({ user: null, loading: false });
      return data;
    } catch (err) {
      set({
        user: null,
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // LOAD USER (on app start)
  loadUser: async () => {
    set({ isAuthChecking: true });
    try {
      const { data } = await api.get("/api/user/me");
      if (data) {
        set({ user: data, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      set({ isAuthChecking: false });
    }
  },

  // UPDATE PROFILE
  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.put("/api/user/me", updates);
      if (data) {
        set({ user: data, loading: false });
        toast.success("Updated successfully!");
      } else {
        set({ user: null, loading: false });
      }
    } catch (err) {
      set({
        user: null,
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
