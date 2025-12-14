import React, { useState, useEffect, useCallback } from "react";
import { asserts } from "../assets/assets";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { UserRound, Phone, MapPin, Car, Calendar, Clock } from "lucide-react";
import { api } from "../config/api";

function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const loading = false;

  const [activeTab, setActiveTab] = useState("Bookings");
  const tabs = ["Bookings", "Account"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const navigate = useNavigate();

  // Fetch bookings
  const fetchBookingsLocal = useCallback(async () => {
    if (!user) return;

    setBookingsLoading(true);
    try {
      const response = await api.get("/api/service/taxi/my-bookings");
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        toast.error("Failed to load bookings: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
      toast.error(
        error.response?.data?.message || "Could not load booking history."
      );
    } finally {
      setBookingsLoading(false);
    }
  }, [user]);

  // Cancel booking - Updates status to "cancelled"
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const response = await api.delete(
        `/api/service/taxi/bookings/${bookingId}`
      );
      if (response.data.success) {
        toast.success("Booking cancelled successfully");
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled", cancelledAt: new Date() }
              : booking
          )
        );
      } else {
        toast.error("Failed to cancel booking: " + response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Could not cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  // Initialize profile fields and fetch bookings
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      fetchBookingsLocal();
    }
  }, [user, fetchBookingsLocal]);

  const handleChangeField = (e) => {
    e.preventDefault();
    const updated = {
      name,
      password,
      email,
    };
    updateProfile(updated);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="pb-24">
      {/* Background header */}
      <div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${asserts.userBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="relative h-80 z-10"
      ></div>

      {/* Profile Image and Info */}
      <div className="relative z-20 md:ml-8 -mt-20 flex md:flex-row flex-col gap-1 md:items-center w-fit mx-auto">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            className="size-44 object-center object-cover rounded-full border-4 border-white bg-white"
            alt={`${user.name}'s Profile`}
          />
        ) : (
          <div className="size-36 rounded-full border-4 border-white bg-white flex items-center justify-center">
            <UserRound size={80} className="text-gray-400" />
          </div>
        )}

        <div className="md:mt-22 md:text-left mt-1 text-center">
          <h2 className="text-2xl font-semibold">{user?.name}</h2>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="md:mx-8 mx-4 md:mt-8 mt-4">
        <div className="flex items-center justify-evenly bg-white px-4 py-3 rounded-xl border border-gray-200">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex flex-col items-center cursor-pointer px-2"
            >
              <h3
                className={`text-lg font-medium ${
                  activeTab === tab ? "text-black" : "text-gray-500"
                }`}
              >
                {tab}
              </h3>

              <div
                className={`h-1 w-full mt-1 rounded-full transition-all duration-300 ${
                  activeTab === tab ? "bg-green-300" : "bg-transparent"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "Bookings" ? (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {bookingsLoading && (
                <p className="text-lg text-gray-500 font-semibold p-4 text-center">
                  Loading your booking history...
                </p>
              )}

              {!bookingsLoading && bookings.length === 0 && (
                <p className="text-lg text-gray-500 p-4 text-center">
                  You have no booking history yet.
                </p>
              )}

              {!bookingsLoading && bookings.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Vehicle Image */}
                        <div className="md:w-64 w-full h-48 md:h-auto">
                          <img
                            src={
                              booking.vehicleDetails?.image ||
                              asserts.defaultTaxiImage
                            }
                            alt={booking.vehicleDetails?.name || "Taxi"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {booking.model ||
                                  booking.vehicleDetails?.model ||
                                  "Unknown Vehicle"}{" "}
                                {booking.vehicleDetails?.vehicleNo || "N/A"}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {booking.vehicleType || "Car"}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status || "Pending"}
                            </span>
                          </div>

                          {/* Grid for details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            {/* Driver Name */}
                            {booking.vehicleDetails?.driverName && (
                              <div className="flex items-center gap-2 text-sm">
                                <UserRound className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                                  <span className="font-medium">Driver:</span>{" "}
                                  {booking.vehicleDetails.driverName}
                                </span>
                              </div>
                            )}

                            {/* Contact */}
                            {(booking.vehicleDetails?.contact1 ||
                              booking.vehicleDetails?.contact2) && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                                  <span className="font-medium">Contact: </span>

                                  {/* Display Contact 1 */}
                                  {booking.vehicleDetails?.contact1}

                                  {/* Display Separator '|' ONLY if both contact1 and contact2 exist */}
                                  {booking.vehicleDetails?.contact1 &&
                                    booking.vehicleDetails?.contact2 && (
                                      <span className="mx-1">|</span>
                                    )}

                                  {/* Display Contact 2 */}
                                  {booking.vehicleDetails?.contact2}
                                </span>
                              </div>
                            )}

                            {/* Date */}
                            {booking.date && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                                  <span className="font-medium">Date:</span>{" "}
                                  {new Date(booking.date).toLocaleDateString()}
                                </span>
                              </div>
                            )}

                            {/* Time */}
                            {booking.time && (
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                                  <span className="font-medium">Time:</span>{" "}
                                  {booking.time}
                                </span>
                              </div>
                            )}

                            {/* City/Province */}
                            {(booking.city || booking.province) && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                                  <span className="font-medium">Location:</span>{" "}
                                  {booking.city}
                                  {booking.city && booking.province && ", "}
                                  {booking.province}
                                </span>
                              </div>
                            )}

                            {/* Price per km */}
                            {booking.perKm && (
                              <div className="flex items-center gap-2 text-sm">
                                <Car className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                                  <span className="font-medium">Rate:</span> LKR{" "}
                                  {booking.perKm}/km
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Route */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Route:
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">
                                {booking.pickup}
                              </span>
                              <span className="mx-2">→</span>
                              <span className="font-semibold">
                                {booking.dropup}
                              </span>
                            </p>
                          </div>

                          {/* Note */}
                          <div className="text-xs mb-3 text-red-600 font-medium">
                            <h3>
                              Note: Please contact provider for more details!
                            </h3>
                          </div>

                          {/* Cancel Button */}
                          {booking.status?.toLowerCase() !== "cancelled" &&
                            booking.status?.toLowerCase() !== "completed" && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={cancellingId === booking._id}
                                className="w-full md:w-auto px-6 py-2 bg-green-300 hover:bg-green-400 text-black rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                {cancellingId === booking._id
                                  ? "Cancelling..."
                                  : "Cancel Booking"}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 mt-6 rounded-md px-4 py-8"
            >
              <div className="space-y-4 mx-auto max-w-xl">
                {/* Name */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <p className="sm:w-20 font-medium">Name</p>
                  <input
                    type="text"
                    placeholder="Name"
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="border border-green-300 px-4 py-1 rounded-md hover:bg-green-100 transition"
                    onClick={handleChangeField}
                    disabled={loading}
                  >
                    Change
                  </button>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <p className="sm:w-20 font-medium">Email</p>
                  <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className="border border-green-300 px-4 py-1 rounded-md hover:bg-green-100 transition"
                    onClick={handleChangeField}
                    disabled={loading}
                  >
                    Change
                  </button>
                </div>

                {/* Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <p className="sm:w-20 font-medium">Password</p>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="border border-green-300 px-4 py-1 rounded-md hover:bg-green-100 transition"
                    onClick={handleChangeField}
                    disabled={loading}
                  >
                    Change
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default UserProfile;
