import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaxiSearch from "../../components/TaxiSearch.jsx";
import TaxiFilter from "../../components/TaxiFilter.jsx";
import { useTaxiStore } from "../../store/taxiStore.js";

const TaxiBookings = () => {
  const navigate = useNavigate();

  const { availableTaxis, pickup, searchLoading, searchError } = useTaxiStore();

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setFilteredVehicles(availableTaxis);

    if (searchError) {
      console.error("Error fetching taxis:", searchError);
    }
  }, [availableTaxis, searchError]);

  const handleFilterChange = (newFilters) => {
    const filtered = availableTaxis.filter((vehicle) => {
      return (
        vehicle.perKm >= newFilters.priceRange.min &&
        vehicle.perKm <= newFilters.priceRange.max &&
        (newFilters.selectedModels.length === 0 ||
          newFilters.selectedModels.includes(vehicle.model)) &&
        (newFilters.selectedFuelTypes.length === 0 ||
          newFilters.selectedFuelTypes.includes(vehicle.fuelType)) &&
        (newFilters.selectedCarTypes.length === 0 ||
          (vehicle.carType &&
            newFilters.selectedCarTypes.includes(vehicle.carType)))
      );
    });
    setFilteredVehicles(filtered);
  };

  const viewVehicle = (vehicle) => {
    // Get the vehicle id
    const vehicleId = vehicle._id || vehicle.id;

    // Validate that we have an id before navigating
    if (!vehicleId) {
      console.error("Vehicle ID is missing:", vehicle);
      alert("Cannot view vehicle - ID is missing");
      return;
    }

    // Navigate to the specific taxi page
    navigate(`/specific-taxi/${vehicleId}`);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <>
      {/* Search bar section */}
      <div className="relative w-11/12 mx-auto mt-10 md:mt-32 lg:mt-20 mb-8">
        <TaxiSearch />
      </div>

      {/* Main content section */}
      <div className="w-11/12 mx-auto mb-20">
        {/* Filter toggle button for (mobile only) */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilter}
            className="w-full py-2 bg-green-200 hover:bg-green-300 text-black font-semibold rounded-md flex items-center justify-center transition-colors"
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 0V4m0 20v-2m6 2a2 2 0 100-4m0 4a2 2 0 110-4m0 0v-2"
              />
            </svg>
          </button>
        </div>

        {/* Content grid */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side filter section */}
          <div
            className={`${
              showFilter ? "block" : "hidden"
            } md:block md:w-1/4 lg:w-1/5 pt-4 rounded-md self-start sticky top-24`}
          >
            <TaxiFilter
              vehicles={availableTaxis}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Right side results section */}
          <div className="w-full md:w-3/4 lg:w-4/5 drop-shadow-md">
            <div className="flex flex-wrap items-center p-4 mb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-black mr-2">
                {pickup || "Location"}
              </h2>
              <div className="hidden sm:block h-10 border-l border-gray-400 mx-3"></div>
              <span className="text-gray-800 text-lg md:text-xl font-medium">
                {searchLoading
                  ? "Searching..."
                  : `${filteredVehicles.length} Vehicles found`}
              </span>
            </div>

            {/* Results list */}
            <div>
              {/* Display loading state */}
              {searchLoading && (
                <div className="bg-white p-8 rounded-md text-center shadow-sm">
                  <p className="text-lg text-gray-700">
                    Loading available taxis...
                  </p>
                </div>
              )}

              {/* Display error state */}
              {searchError && !searchLoading && (
                <div className="bg-red-100 p-8 rounded-md text-center shadow-sm">
                  <p className="text-lg text-red-700">Error: {searchError}</p>
                  <p className="text-sm text-red-500">
                    Please try a different location or check your connection.
                  </p>
                </div>
              )}

              {/* Display results */}
              {!searchLoading && !searchError && filteredVehicles.length > 0 ? (
                <div className="w-full">
                  {filteredVehicles.map((vehicle) => {
                    // Ensure we have a valid id
                    const vehicleKey =
                      vehicle._id || vehicle.id || Math.random();

                    return (
                      <div
                        key={vehicleKey}
                        className="flex flex-col sm:flex-row shadow-lg rounded-lg mb-4 gap-3 overflow-hidden bg-white"
                      >
                        {/* Taxi image */}
                        <div className="w-full sm:w-auto sm:flex-shrink-0">
                          <img
                            className="w-full sm:w-56 md:w-64 h-48 sm:h-56 object-cover rounded-t-lg sm:rounded-t-none sm:rounded-l-lg"
                            src={vehicle.images?.[0] || "/default-vehicle.png"}
                            alt={vehicle.model || "Vehicle"}
                            onError={(e) => {
                              e.target.src = "/default-vehicle.png";
                            }}
                          />
                        </div>

                        {/* Driver image and details */}
                        <div className="flex flex-col sm:flex-row w-full p-3 sm:p-0">
                          {/* Driver image */}
                          <div className="flex justify-start sm:justify-center items-start sm:p-1 pt-4">
                            <img
                              className="w-10 h-10 rounded-full mr-3 sm:mr-0 object-cover"
                              src={vehicle.profilePic || "/default-avatar.png"}
                              alt={vehicle.driverName || "Driver"}
                              onError={(e) => {
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                          </div>

                          {/* Details area */}
                          <div className="flex flex-col w-full p-1 sm:p-2">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h1 className="text-lg font-semibold text-left">
                                  {vehicle.driverName || "Unknown Driver"}
                                </h1>
                                <h2 className="text-xs font-medium text-gray-600 text-left">
                                  {vehicle.city || "Location not specified"}
                                </h2>
                              </div>

                              <div className="text-right">
                                <h3 className="text-gray-600 font-semibold text-xs">
                                  Starting from
                                </h3>
                                <p className="font-bold text-green-400 text-sm sm:text-xl">
                                  LKR {vehicle.perKm || "0"}/km
                                </p>
                              </div>
                            </div>

                            <div className="text-gray-600 text-base md:text-xl font-bold text-left">
                              {vehicle.model || "Unknown Model"}{" "}
                              {vehicle.vehicleNo || ""}
                            </div>

                            {/* View vehicle button that will redirect you to specific taxi */}
                            <div className="mt-2 mb-0 sm:mt-auto">
                              <button
                                onClick={() => viewVehicle(vehicle)}
                                className="w-full bg-green-300 hover:bg-green-400 text-black py-2 rounded-xl font-semibold transition-colors"
                              >
                                View Vehicle
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Display no results found */
                !searchLoading &&
                !searchError && (
                  <div className="bg-white p-8 rounded-md text-center shadow-sm">
                    <p className="text-lg text-gray-700">
                      Sorry, no vehicles found matching your criteria.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxiBookings;
