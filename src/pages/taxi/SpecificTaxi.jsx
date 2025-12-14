import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import StartJourney from "../../components/StartJourney";
import TestimonialCard from "../../components/TestimonialCard";
import { useTaxiStore } from "../../store/taxiStore";

const SpecificTaxi = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const startJourneyRef = useRef(null);
  const { availableTaxis } = useTaxiStore();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPlatformReviews = () => {};

  useEffect(() => {
    // Check if vehicleId exists
    if (!vehicleId) {
      console.error("No vehicle ID provided in URL");
      navigate("/taxi-bookings", { replace: true });
      return;
    }

    // Check if availableTaxis has loaded
    if (availableTaxis.length === 0) {
      return;
    }

    // Try to find the vehicle
    const foundVehicle = availableTaxis.find((v) => {
      const id = v._id || v.id;
      return id && id.toString() === vehicleId;
    });

    if (foundVehicle) {
      setVehicle(foundVehicle);
      setLoading(false);
    } else {
      // Vehicle not found after taxis loaded
      console.warn(`Vehicle ID ${vehicleId} not found in available taxis.`);
      navigate("/taxi-bookings", { replace: true });
    }
  }, [vehicleId, availableTaxis, navigate]);

  if (!vehicle) {
    navigate("/taxi-bookings", { replace: true });
  }
  if (loading || !vehicle) {
    return (
      <div className="relative top-24 w-full text-center p-10">
        <p className="text-xl font-medium text-gray-700">
          Loading vehicle details...
        </p>
      </div>
    );
  }

  // Function to handle scrolling
  const handleHireNowClick = () => {
    // Check if the reference exists and has a current element (the div)
    if (startJourneyRef.current) {
      startJourneyRef.current.scrollIntoView({
        behavior: "smooth", // Makes the scroll animated
        block: "start", // Aligns the element to the top of the viewport
      });
    }
  };

  return (
    <>
      <div className="relative w-[75%] sm:w-[80%] lg:w-[90.5%] left-1/2 transform -translate-x-1/2">
        {/* Vehicle Header */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg w-full">
          {/* Left part - Driver Image and Name */}
          <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
            <img
              src={vehicle.profilePic || "/default-avatar.png"}
              alt="Driver"
              className="w-15 h-15 rounded-full mr-4 object-cover"
              onError={(e) => {
                e.target.src = "/avatar.png";
              }}
            />
            <div>
              <h2 className="text-sm md:text-2xl font-bold text-black text-left">
                {vehicle.model}
                <span className="ml-3 text-sm md:text-2xl">
                  {vehicle.vehicleNo}
                </span>
              </h2>
              <p className="text-sm text-gray-500 text-left">
                {vehicle.driverName}
              </p>
            </div>
          </div>

          {/* Right part - Price and Button */}
          <div className="flex flex-col items-end w-full md:w-auto">
            <div className="text-black font-bold text-sm md:text-2xl mb-2 md:mb-1 text-left md:text-right w-full md:w-auto md:p-3">
              LKR {vehicle.perKm || "0"}/km
            </div>
            <button
              onClick={handleHireNowClick}
              className="bg-green-200 text-black px-4 py-2 w-full text-xs sm:text-sm md:w-auto rounded-xl font-semibold hover:bg-green-300 transition-colors"
            >
              Hire Now
            </button>
          </div>
        </div>

        {/* Vehicle Image */}
        <div className="w-full h-52 md:h-[400px]">
          <img
            src={vehicle.images?.[0] || "/default-vehicle.png"}
            alt="Vehicle"
            className="w-full h-full object-cover mt-3 rounded-md md:rounded-md"
            onError={(e) => {
              e.target.src = "/default-vehicle.png";
            }}
          />
        </div>

        {/* Driver Bio */}
        <div className="pt-5">
          <h1 className="h-auto text-gray-600 font-medium text-xs sm:text-sm md:text-sm text-left">
            {vehicle.driverBio || "No bio available"}
          </h1>
        </div>

        {/* About Driver & Facilities */}
        <div className="pt-4 sm:pt-10">
          {/* Left side - About Driver */}
          <h1 className="text-sm sm:text-xl text-gray-600 bg-transparent font-bold text-center sm:text-left py-2">
            About the Driver
          </h1>
          <div className="h-auto lg:h-auto w-full lg:col-span- shadow-lg rounded-xl bg-white relative">
            <div className="flex items-center p-4 md:p-8 lg:flex-row flex-col">
              <img
                src={vehicle.profilePic || "/default-avatar.png"}
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover"
                alt="Driver"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="text-left text-gray-600 font-bold ml-4">
                <h1 className="text-base md:text-xl">{vehicle.driverName}</h1>
                <div className="flex items-center  flex-col md:flex-row">
                  <MapPin className="w-4 md:w-4 text-gray-500" />
                  <h1 className="ml-1 text-gray-400 text-xs">
                    {vehicle.city || "Location not specified"}
                  </h1>
                </div>
              </div>
            </div>
            <div className="w-[90%] h-[1px] bg-gray-300 mx-auto"></div>
            <div className="md:py-8 py-4 h-auto">
              <h1 className="text-left text-gray-500 text-sm sm:text-sm font-medium mx-6">
                I'm {vehicle.driverName}!
              </h1>
              <h1 className="text-left font-medium text-xs sm:text-sm mx-6 text-gray-500 mt-4">
                {vehicle.description || "No description available"}
              </h1>
            </div>
          </div>

          {/* Right side - Facilities */}
        </div>

        {/* Start Journey */}
        <div className="mb-30 " ref={startJourneyRef}>
          <StartJourney vehicle={vehicle} />
        </div>
      </div>
    </>
  );
};

export default SpecificTaxi;
