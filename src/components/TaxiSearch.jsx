import React, { useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, CarFront } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTaxiStore } from "../store/taxiStore";
import { DISTRICTS } from "../utils/utils";

const TaxiSearch = () => {
  const navigate = useNavigate();
  const {
    setPickup,
    setDrop,
    setVehicleType,
    drop,
    pickup,
    vehicleType,
    fetchAvailableTaxis, // zustand action that calls the api endpoint
    searchLoading, // Get loading state for button/UX
  } = useTaxiStore();

  // Helper function to gather all search parameters
  const getUserData = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const time = now.toTimeString().slice(0, 5); // HH:MM

    return {
      date,
      time,
      drop,
      pickup,
      vehicleType,
    };
  };

  //fetched available taxis when component mounts
  useEffect(() => {
    if (pickup && drop && vehicleType) {
      const userData = getUserData(); // This calls the API and updates the 'availableTaxis' in the store // The TaxiBookings page will instantly react to this change.
      fetchAvailableTaxis(userData);
    }
  }, [pickup, drop, vehicleType, fetchAvailableTaxis]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "pickup":
        setPickup(value); //update store values globally
        break;
      case "drop":
        setDrop(value);
        break;
      case "vehicleType":
        setVehicleType(value);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Basic validation before navigating

    if (!pickup || !drop || !vehicleType) {
      alert("Please fill in all required search fields.");
      return;
    }
    navigate("/taxi-bookings");
  };
  const selectClasses =
    "w-full border border-gray-400 text-gray-500 rounded-md p-3 pl-10 pr-3 text-sm sm:text-base outline-none bg-white appearance-none";

  const labelClasses =
    "absolute -top-2 left-3 bg-white px-1 text-xs sm:text-sm text-gray-600";

  return (
    <div className="bg-white rounded-2xl drop-shadow-md overflow-hidden max-w-full p-4 sm:p-7 z-50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-start text-left text-gray-600 text-sm font-medium">
          <span>Where you want to go</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Pickup District */}
          <div className="relative w-full">
            <select
              name="pickup"
              value={pickup}
              onChange={handleChange}
              className={selectClasses}
              required
            >
              <option value="" disabled hidden>
                Select Pickup District
              </option>

              {DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <label htmlFor="pickup" className={labelClasses}>
              Pickup District
            </label>
            <ArrowDownLeft
              className="absolute top-[35%] left-3 text-gray-800"
              size={18}
            />
          </div>
          {/* 2. Drop Destination */}
          <div className="relative w-full">
            <input
              type="text"
              name="drop"
              id="drop"
              value={drop}
              onChange={handleChange}
              placeholder="Enter City, Town, or Hotel Name"
              className={selectClasses.replace("appearance-none", "")}
              required
            />
            <label htmlFor="drop" className={labelClasses}>
              Drop Destination
            </label>
            <ArrowUpRight
              className="absolute top-[35%] left-3 text-gray-800"
              size={18}
            />
          </div>
          {/* 3. Vehicle Type */}
          <div className="relative w-full">
            <select
              name="vehicleType"
              value={vehicleType}
              onChange={handleChange}
              className={selectClasses}
              required
            >
              <option value="" disabled hidden>
                Select Vehicle Type
              </option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="TukTuk">TukTuk</option>
            </select>

            <label htmlFor="medium" className={labelClasses}>
              Medium
            </label>
            <CarFront
              className="absolute top-[35%] left-3 text-gray-800"
              size={18}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={searchLoading} // Disable button while search is running
            className={`
 text-black text-sm sm:text-md font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md transition duration-200
 ${
   searchLoading
     ? "bg-gray-300 cursor-not-allowed"
     : "bg-green-300 hover:bg-green-400"
 }`}
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxiSearch;
