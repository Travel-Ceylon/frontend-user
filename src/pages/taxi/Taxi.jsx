import React from "react";
import {
  Car,
  ShieldCheck,
  CalendarClock,
  CreditCard,
  Accessibility,
} from "lucide-react";
import taxiBg from "../../assets/taxiBg.jpg";
import TaxiSearch from "../../components/TaxiSearch";
import { asserts } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Car,
    title: "Vehicle Choice",
    description: "5 types of vehicles",
  },
  {
    icon: ShieldCheck,
    title: "Safety & Support",
    description: "Verified drivers with ratings",
  },
  {
    icon: CalendarClock,
    title: "Easy Booking",
    description: "24/7 availability",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Cash/Card/Digital wallets",
  },
  {
    icon: Accessibility,
    title: "Special Needs",
    description: "Child seats available",
  },
];

const vehicles = [
  {
    id: 1,
    name: "Tuktuk",
    price: 10,
    image: "/tuktuk.png",
    description: "Ideal for short trips and city travel.",
    features: [
      "Max 3 passengers",
      "Local, expert driver",
      "Open air experience",
    ],
  },
  {
    id: 2,
    name: "Car",
    price: 20,
    image: "/cars.png",
    description: "Comfortable sedans/hatchbacks for up to four people.",
    features: ["Max 4 passengers", "AC comfort", "Suitable for long distances"],
  },
  {
    id: 3,
    name: "Van",
    price: 30,
    image: "/van.jpg",
    description: "Spacious vehicles for families and small groups.",
    features: ["Max 7 passengers", "Luggage capacity", "Adjustable seating"],
  },
  {
    id: 4,
    name: "Bus",
    price: 50,
    image: "buses.png",
    description: "Perfect for large group tours and events.",
    features: [
      "Max 30+ passengers",
      "Bulk luggage storage",
      "On-board PA system (optional)",
    ],
  },
];

const Taxi = () => {
  const navigate = useNavigate();

  const hireVehicle = (item) => {
    const initialFormData = {
      pickup: "All of Sri Lanka",
      medium: item.name.slice(0, -1).toLowerCase(),
      pickupDate: "",
      returnDate: "",
    };
    console.log("Navigate to rent-taxi with", initialFormData);
    navigate("/taxi-bookings");
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full">
        <div
          style={{
            backgroundImage: `url(${taxiBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="h-[65vh] sm:h-[70vh] w-full relative md:px-14 px-4 py-8 sm:py-12 text-white flex items-center"
        >
          <div className="mb-70 sm:mb-40 text-white space-y-2">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold leading-tight">
              Plan your ride,
              <br />
              we'll take you
              <br />
              there!
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-100">
              Special offers to suit your plan.
            </p>
          </div>
        </div>

        <div className="relative -mt-70 sm:-mt-40 z-10 xl:mx-12 mx-4">
          <TaxiSearch />
        </div>
      </section>

      {/* Start your journey */}
      <div className="xl:mx-12 mx-4 bg-green-200 mb-6 sm:mb-8 rounded-2xl shadow-xl p-6 sm:p-10 mt-12 sm:mt-16">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl mb-1 sm:mb-2 font-bold">
          Start your journey
        </h2>
        <p className="text-xs sm:text-sm md:text-sm leading-relaxed">
          Explore Sri Lanka on your terms, with the ultimate comfort and
          convenience of a dedicated, professional driver! Whether you're a
          local resident embarking on a local trip or an international visitor
          planning an extensive tour, you can effortlessly book the perfect
          vehicle and driver tailored precisely for your journey. Experience the
          true freedom of personalized travel and hit the road with absolute
          confidence.
        </p>

        <div className="w-full mt-5 sm:mt-8">
          {/* Desktop Grid */}
          <div className="hidden sm:flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-14">
              {vehicles.map((item) => (
                <div
                  key={item.id}
                  className="w-44 sm:w-44 md:w-58 h-56 sm:h-60 md:h-80 rounded-xl shadow-md overflow-hidden relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 text-white">
                    <div className="flex gap-2 items-center justify-between">
                      <p className="text-xs sm:text-lg font-semibold">
                        {item.name}
                      </p>
                      <p className="font-bold text-sm sm:text-base md:text-xl">
                        ${item.price}
                      </p>
                    </div>
                    <p className="text-xs sm:text-xs mb-2 -mt-1 font-medium">
                      starting from
                    </p>

                    <button
                      onClick={() => hireVehicle(item)}
                      className="w-full bg-green-300 hover:bg-green-400 rounded-full text-black text-xs sm:text-sm px-3 py-1.5 transition-all font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Swipeable */}
          <div
            className="sm:hidden flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`
        .vehicles-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
            {vehicles.map((item) => (
              <div
                key={item.id}
                className="min-w-[200px] h-66 sm:h-72 rounded-xl shadow-md overflow-hidden relative group snap-center vehicles-scroll flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-white">
                  <div className="flex gap-2 items-center justify-between">
                    <p className="text-base font-semibold">{item.name}</p>
                    <p className="font-bold text-lg">${item.price}</p>
                  </div>
                  <p className="text-xs mb-2 -mt-1 font-medium">
                    starting from
                  </p>

                  <button
                    onClick={() => hireVehicle(item)}
                    className="w-full bg-green-300 hover:bg-green-400 rounded-full text-black text-sm px-3 py-1.5 transition-all font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="xl:mx-12 bg-white shadow-xl mx-4 mb-6 sm:mb-8 rounded-xl p-6 sm:p-10 mt-12 sm:mt-16">
        <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-2">
          What we offer
        </h2>
        <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-2">
          Enjoy seamless travel across Sri Lanka with our safe, reliable rides.
          Choose from tuktuks, cars, or vans—all with verified drivers,
          transparent pricing, and 24/7 support. Book instantly and pay your
          way!
        </p>

        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-5 mt-4 sm:mt-5 w-fit mx-auto">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className="w-32 sm:w-36 md:w-56 h-56 bg-green-200 rounded-xl flex flex-col justify-center gap-1 sm:gap-2 items-center p-3 sm:p-4"
            >
              <Icon className="size-8 sm:size-9 md:size-11" />
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-black/80 text-center -mt-2">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Swipeable */}
        <div
          className="sm:hidden flex gap-3 overflow-x-auto mt-3 pb-3 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className="min-w-[130px] h-36 bg-green-200 rounded-xl flex flex-col justify-center gap-1 items-center p-3 snap-center"
            >
              <Icon className="size-7" />
              <h3 className="text-xs font-semibold text-center">{title}</h3>
              <p className="text-xs text-black/80 text-center">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Journey Section */}
      <div className="xl:mx-12 mx-4 mb-6 sm:mb-8 p-4 mt-12 sm:mt-16 sm:p-5 md:p-10 grid lg:grid-cols-[2.5fr_2fr] gap-3 sm:gap-5 grid-cols-1 bg-white shadow-xl rounded-xl">
        <div className="flex flex-col justify-center lg:justify-start px-10 items-start max-w-xl">
          <h2 className="text-base sm:text-xl md:text-2xl lg:text-4xl font-semibold leading-tight">
            Where Every Journey
          </h2>
          <h2 className="text-base sm:text-xl md:text-2xl  lg:text-4xl font-semibold leading-tight">
            Feels Like First Class
          </h2>
          <p className="text-xs font-semibold sm:text-sm md:text-base mt-2 sm:mt-3 text-black/90 leading-relaxed">
            At travelCeylon, we connect you to Sri Lanka's most reliable rides
            from buzzing tuktuks in Colombo to luxury SUVs for scenic hill
            country routes. Every driver is verified and every fare is
            transparent, so you can explore with confidence.
          </p>
          <p className="text-xs sm:text-sm md:text-base font-light mt-3 sm:mt-4 text-black/70 leading-relaxed">
            Tuktuks for quick hops • AC cars for long trips • Family-sized vans
            • Instant bookings • 24/7 availability • Flight tracking for airport
            pickups • Upfront fares • No surge pricing • Multiple payment
            options • GPS-tracked rides • Verified drivers • Emergency support
          </p>
        </div>
        <div className="flex lg:justify-end justify-center items-center">
          <img
            src={asserts.taxiBanner}
            alt="Travel Banner"
            className="max-w-full max-h-[250px] sm:max-h-[350px] md:max-h-[450px] rounded-lg"
          />
        </div>
      </div>

      {/* Partner Section */}
      <div className="grid grid-cols-1 mt-12 sm:mt-16 lg:grid-cols-2 gap-3 sm:gap-4 p-6  lg:pb-0 bg-green-200 xl:mx-12 mx-4 mb-20 sm:mb-20 rounded-xl border border-gray-200">
        <div className="pt-3 hidden lg:block">
          <img
            src={asserts.taxibtm}
            className="max-w-full  max-h-[220px] sm:max-h-[320px] lg:max-h-[380px] lg:rounded-l-xl mx-auto"
            alt="Partner with us"
          />
        </div>
        <div className="p-4 sm:p-5 md:p-10 lg:mr-20 text-center">
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
            Partner with Sri Lanka's
          </h1>
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
            Favorite Ride Platform
          </h1>
          <p className="text-xs sm:text-sm md:text-base mt-2 sm:mt-3 text-left leading-relaxed">
            Are you a taxi, tuktuk, or private vehicle driver? Partner with
            travelCeylon and connect with thousands of travelers exploring Sri
            Lanka! From city rides to scenic tours, we match you with riders who
            value safety, fair pricing, and reliable service.
          </p>
          <p className="text-xs sm:text-sm text-left md:text-base font-medium mt-2 sm:mt-3">
            List your property to reach thousands of travelers
          </p>
          <button
            onClick={() => console.log("Navigate to /taxi")}
            className="mt-3 sm:mt-5 px-5 sm:px-7 py-1.5 text-left text-black sm:py-2 text-xs sm:text-sm md:text-base rounded-full bg-green-300 cursor-pointer hover:bg-green-400 transition-colors"
          >
            List Your Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Taxi;
