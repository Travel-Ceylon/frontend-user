import { create } from "zustand";
import { api } from "../config/api";
import toast from "react-hot-toast";

export const useTaxiStore = create((set) => ({
  availableTaxis: [],
  searchLoading: false,
  searchError: null,
  pickup: "",
  drop: "Mirissa",
  vehicleType: "Car",

  bookings: [], // state to hold fetched bookings
  bookingsLoading: false, // state for loading indicator

  //setters for the states
  setPickup: (newPickup) => set({ pickup: newPickup }),
  setDrop: (newDrop) => set({ drop: newDrop }),
  setVehicleType: (newVehicleType) => set({ vehicleType: newVehicleType }),

  fetchAvailableTaxis: async (searchParams) => {
    set({ searchLoading: true, searchError: null });
    const { time, date, pickup, drop, vehicleType } = searchParams;

    //create the api url using pickup,vehicleType
    const apiUrl = `/api/service/taxi/available?date=${date}&time=${time}&pickup=${pickup}&drop=${drop}&vehicleType=${vehicleType}`;

    try {
      const { data } = await api.get(apiUrl);
      if (data && data.success) {
        const taxiData = data.data || [];

        set({
          availableTaxis: taxiData,
          searchLoading: false,
        });
        return taxiData;
      } else {
        throw new Error(
          data?.message || "Search failed with an unknown error."
        );
      }
    } catch (error) {
      // Handle network/server errors
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to connect to the search server.";

      // Log the error and update the state
      console.error("Taxi Search Error:", error);
      set({
        searchError: errorMessage,
        searchLoading: false,
      });

      // Re-throw the error so the component knows the call failed
      throw error;
    }
  },

  // Action to fetch bookings to the certain provider
  fetchBookings: async () => {
    set({ bookingsLoading: true });
    try {
      const response = await api.get("/api/service/taxi/my-bookings");
      if (response.data.success) {
        set({ bookings: response.data.data, bookingsLoading: false });
        return response.data.data;
      }
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
      set({ bookingsLoading: false });
      toast.error(
        error.response?.data?.message || "Could not load booking history."
      );
      throw error;
    }
  },
}));
