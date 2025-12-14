import { useState, useEffect } from "react";
import { CalendarDays, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DISTRICTS } from "../utils/utils";
import { useTaxiStore } from "../store/taxiStore";
import { api } from "../config/api";
import toast from "react-hot-toast";

export default function StartJourney({ vehicle }) {
  const { drop } = useTaxiStore();

  const [selectedPickup, setSelectedPickup] = useState(
    vehicle?.city || "Unknown Location"
  );
  const [selectedDrop, setSelectedDrop] = useState(drop || "Mirissa");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Helper function to get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to get the current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    setDate(getCurrentDate());
    setTime(getCurrentTime());
    // Update pickup if the vehicle object loads late
    if (vehicle?.location && vehicle.location !== selectedPickup) {
      setSelectedPickup(vehicle.location);
    }
  }, [vehicle.location]);

  const handleRequest = async (state) => {
    try {
      setLoading(true);
      const response = await api.post(`/api/service/taxi/booking`, state); //caling the api with states as the req body
      if (response && response.status === 201) {
        toast.success("Booking request successful");
        setLoading(false);
        navigate("/user");
      } else {
        toast.error("Booking request failed unexpectedly.");
      }
    } catch (error) {
      const serverMessage = error?.response?.data?.message;
      toast.error(serverMessage || "An unknown error occurred during booking.");
      console.error("Handle request error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <h2 className="text-sm sm:text-xl font-bold text-gray-600 my-8 text-center sm:text-left">
        Start the Journey
      </h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden w-full flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-2/5 flex items-center justify-center">
          <div className="w-full lg:w-[80%] p-5 sm:p-3 lg:p-10">
            <img
              src={vehicle.images[0]}
              alt="Taxi"
              className="w-full h-full md:h-full object-cover rounded-md"
            />
          </div>
        </div>
        {/* Form Content */}
        <div className="w-full md:w-3/5 p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
            {/* Pickup (read only)*/}
            <div className="relative w-full">
              <input
                type="text"
                id="pickup"
                className="w-full border border-gray-400 rounded-md p-3 text-xs sm:text-sm outline-none  cursor-not-allowed"
                value={selectedPickup}
                readOnly // makes un clickable
              />

              <label
                htmlFor="pickup"
                className="absolute -top-2 left-2 bg-white px-1 text-xs sm:text-sm text-gray-600"
              >
                Pickup (Fixed)
              </label>
            </div>
            {/* Drop field can be edited as user preference*/}
            <div className="relative w-full">
              <input
                type="text"
                id="drop"
                className="w-full border border-gray-400 rounded-md p-3 text-xs sm:text-sm outline-none"
                placeholder="Enter destination"
                value={selectedDrop}
                onChange={(e) => setSelectedDrop(e.target.value)}
              />

              <label
                htmlFor="drop"
                className="absolute -top-2 left-2 bg-white px-1 text-xs sm:text-sm text-gray-600"
              >
                Drop
              </label>
            </div>
            {/* Date */}
            <div className="relative w-full">
              <input
                type="date"
                id="date"
                className="w-full border border-gray-400 rounded-md p-3 text-xs sm:text-sm outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <label
                htmlFor="date"
                className="absolute -top-2 left-2 bg-white px-1 text-xs sm:text-sm text-gray-600"
              >
                Date
              </label>
            </div>
            {/* Time */}
            <div className="relative w-full">
              <input
                type="time"
                id="time"
                className="w-full border border-gray-400 rounded-md p-3 text-xs sm:text-sm outline-none"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

              <label
                htmlFor="time"
                className="absolute -top-2 left-2 bg-white px-1 text-xs sm:text-sm text-gray-600"
              >
                Time
              </label>
            </div>
          </div>
          {/* Button */}
          <div className="flex justify-center md:justify-end mt-6">
            <button
              onClick={() => {
                const state = {
                  vehicleId: vehicle._id,
                  pick: selectedPickup, // Fixed pickup location
                  drop: selectedDrop,
                  date: date,
                  time: time,
                };
                handleRequest(state);
              }}
              className="bg-green-200 hover:bg-green-300 text-black font-semibold py-2 px-8 rounded-md"
              disabled={loading}
            >
              {loading ? "Requesting..." : "Select"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
