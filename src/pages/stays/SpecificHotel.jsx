import React, { useEffect, useState } from "react";
import { hotelData } from "../../assets/dummyHotelData";
import TestimonialCard from "../../components/TestimonialCard";
import { asserts } from "../../assets/assets";
import { MdLocationOn } from "react-icons/md";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const SpecificHotel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotelId } = useParams();
  const [stay, setStay] = useState(null);
  const toggleReviewOpen = false;

  useEffect(() => {
    const navState = location.state?.stay || null;
    if (navState) {
      const normalized = navState.stay ? navState.stay : navState;
      if (navState.rooms && !normalized.rooms) {
        normalized.rooms = navState.rooms;
      }
      setStay(normalized);
    } else {
      setStay(null);
    }
  }, [location.state]);

  const descriptionParas = (desc) => {
    if (!desc) return [];
    if (Array.isArray(desc)) return desc;
    return String(desc).split(/\n\n|\n/).map((p) => p.trim()).filter(Boolean);
  };

  const normalizeFacilities = (fac) => {
    if (!fac) return [];
    if (Array.isArray(fac)) return fac;
    const map = {
      freeWifi: "Free WiFi",
      airConditioning: "Air Conditioning",
      swimmingPool: "Swimming Pool",
      parking: "Parking",
      breakfast: "Breakfast",
      roomService: "Room Service",
      spa: "Spa",
      bar: "Bar",
      fitnessCenter: "Fitness Center",
      garden: "Garden",
      familyRooms: "Family Rooms",
      waterPark: "Water Park",
      airportShuttle: "Airport Shuttle",
    };
    return Object.keys(fac)
      .filter((k) => fac[k])
      .map((k) => ({ title: map[k] || k, desc: "" }));
  };

  const display = stay || hotelData;
  const rawRooms = stay?.rooms || hotelData.rooms || [];
  // Filter out ObjectId strings (not populated) and normalize room objects
  const rooms = Array.isArray(rawRooms)
    ? rawRooms
        .map((r) => (r?.room ? r.room : r))
        .filter((r) => r && typeof r === "object" && (r.roomType || r.type || r.price))
    : [];
  const facilityList = normalizeFacilities(display.facilities);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-[90vw] mx-auto py-6 grow mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{display.name}</h1>
            <p className="text-gray-500">{display.location}</p>
            <p className="flex items-center text-sm text-gray-600 mt-3">
              <MdLocationOn />
              {display.location}
            </p>
            {display.website && (
              <a href={display.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-sm underline mt-1 inline-block">
                {display.website}
              </a>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <p className="text-lg font-semibold">
              {rooms[0]?.price ? `Rs. ${rooms[0].price}/night` : "—"}
            </p>
            <button className="bg-emerald-400 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
              Book Now
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-6">
          <img
            src={display.profilePic || display.images?.[0] || hotelData.image}
            alt={display.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Snapshot */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Snapshot</h2>
          <div className="space-y-4 text-gray-700">
            {descriptionParas(display.description).length > 0 ? (
              descriptionParas(display.description).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))
            ) : (
              <p className="text-gray-500">No description available.</p>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section className="mb-12">
          <div className=" w-full">
            <h3 className="text-xl font-semibold">What People Say About Us</h3>
            <p className=" text-black/">
              What people say about our facilities and services
            </p>

            <div className="flex gap-10 items-center justify-start mt-5 overflow-x-auto scrollbar-hide w-auto pb-8 pr-8">
              {asserts.testimonials.map((item, index) => (
                <TestimonialCard
                  key={index}
                  user={item.user}
                  country={item.country}
                  text={item.text}
                  rating={item.rating}
                  img={item.img}
                  star={asserts.star}
                />
              ))}
            </div>

            <div className="flex justify-end items-center">
              <button
                onClick={() => toggleReviewOpen()}
                className="px-4 py-2 rounded-md border-2 border-green-300 cursor-pointer"
              >
                Add Review
              </button>
            </div>
          </div>
        </section>

        {/* Surroundings */}
        {display.surroundings && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Hotel surroundings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">Top attractions</h3>
                {display.surroundings?.attractions?.map((item, idx) => (
                  <p key={idx}>
                    {item.name} - {item.distance}
                  </p>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Nature</h3>
                {display.surroundings?.nature?.map((item, idx) => (
                  <p key={idx}>
                    {item.name} - {item.distance}
                  </p>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Practical Access</h3>
                {display.surroundings?.access?.map((item, idx) => (
                  <p key={idx}>
                    {item.name} - {item.distance}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Facilities */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Most popular facilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {facilityList.length > 0 ? (
              facilityList.map((facility, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow rounded-lg p-4 flex flex-col items-center text-center"
                >
                  {facility.icon ? (
                    <img src={facility.icon} alt={facility.title} className="w-8 h-8 mb-2" />
                  ) : (
                    <div className="w-8 h-8 mb-2 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">✓</div>
                  )}
                  <p className="font-semibold">{facility.title}</p>
                  {facility.desc && <p className="text-sm text-gray-500">{facility.desc}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No facilities listed.</p>
            )}
          </div>
        </section>

        {/* Rooms */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border-none">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-5 px-4">Room Type</th>
                  <th className="px-4">Base Price</th>
                  <th className="px-4">Max Guest</th>
                  <th className="px-4">Bed Options</th>
                  <th className="px-4"></th>
                </tr>
              </thead>
              <tbody>
                {rooms.length > 0 ? (
                  rooms.map((room, idx) => (
                    <tr className="py-5" key={room._id || idx}>
                      <td className="py-5 px-4 border-none">{room.roomType || room.type || "—"}</td>
                      <td className="py-2 px-4 border-none">{room.price ? `Rs. ${room.price}` : "—"}</td>
                      <td className="py-2 px-4 border-none">{room.maxGuest ?? "—"}</td>
                      <td className="py-2 px-4 border-none">{room.bedType || room.bed || "—"}</td>
                      <td className="py-2 px-4 border-none">
                        <button
                          className="bg-emerald-400 hover:bg-emerald-700 text-white px-3 py-1 rounded"
                          onClick={() => navigate("/stays/payment", { state: { room, stay: display } })}
                        >
                          Book Now
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-5 px-4 text-gray-500" colSpan={5}>No rooms available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Contact Info */}
        {display.contact && display.contact.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <div className="flex flex-wrap gap-4">
              {display.contact.map((c, idx) => (
                <span key={idx} className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700">{c}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SpecificHotel;
