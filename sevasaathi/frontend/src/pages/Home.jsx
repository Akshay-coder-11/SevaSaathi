import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaBroom,
  FaCalendarCheck,
  FaCarSide,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaHammer,
  FaHardHat,
  FaHome,
  FaPaintRoller,
  FaPhoneAlt,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaTimes,
  FaTools,
  FaUtensils,
  FaWrench,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const services = [
  {
    name: "Mechanic",
    icon: <FaTools />,
    issue: "Bike, car, battery, puncture",
    eta: "18 min",
    price: "From Rs. 249",
    rating: "4.9",
    demand: "High",
    tags: ["Vehicle", "Emergency"],
  },
  {
    name: "Electrician",
    icon: <FaBolt />,
    issue: "Wiring, fan, inverter, switchboard",
    eta: "22 min",
    price: "From Rs. 199",
    rating: "4.8",
    demand: "Fast",
    tags: ["Home", "Emergency"],
  },
  {
    name: "Plumber",
    icon: <FaWrench />,
    issue: "Leakage, tap, motor, drainage",
    eta: "25 min",
    price: "From Rs. 179",
    rating: "4.8",
    demand: "Nearby",
    tags: ["Home", "Emergency"],
  },
  {
    name: "Cleaner",
    icon: <FaBroom />,
    issue: "Deep clean, kitchen, bathroom",
    eta: "Today",
    price: "From Rs. 399",
    rating: "4.7",
    demand: "Popular",
    tags: ["Home", "Planned"],
  },
  {
    name: "Cook",
    icon: <FaUtensils />,
    issue: "Daily meals, party cooking",
    eta: "Same day",
    price: "From Rs. 299",
    rating: "4.9",
    demand: "Trusted",
    tags: ["Home", "Planned"],
  },
  {
    name: "Painter",
    icon: <FaPaintRoller />,
    issue: "Room refresh, waterproofing",
    eta: "Tomorrow",
    price: "Free visit",
    rating: "4.6",
    demand: "Quote",
    tags: ["Home", "Planned"],
  },
  {
    name: "Mason",
    icon: <FaHardHat />,
    issue: "Brick work, plaster, tiles, repair",
    eta: "Today",
    price: "From Rs. 599",
    rating: "4.8",
    demand: "Skilled",
    tags: ["Home", "Planned", "Construction"],
  },
  {
    name: "Laborer",
    icon: <FaHammer />,
    issue: "House construction, shifting, material work",
    eta: "Same day",
    price: "From Rs. 499",
    rating: "4.7",
    demand: "Available",
    tags: ["Home", "Planned", "Construction"],
  },
];

const quickNeeds = ["Emergency", "Home", "Vehicle", "Planned", "Construction"];

const issueByServiceName = {
  Mechanic: "vehicle",
  Electrician: "power",
  Plumber: "water",
  Cleaner: "clean",
  Cook: "meal",
  Painter: "paint",
  Mistri: "build",
  Labour: "labour",
};

const trustStats = [
  { label: "Local helpers checked", value: "1,200+" },
  { label: "Typical arrival time", value: "24 min" },
  { label: "Help after booking", value: "7 days" },
];

const comfortPoints = [
  "You can see the price range before booking",
  "Nearby experts receive your problem details",
  "Emergency work gets priority",
];

const bookingSteps = [
  { title: "Tell us your problem", text: "Leakage, wiring, mason work, or cooking - choose in simple language." },
  { title: "See the best helper", text: "The app suggests suitable experts based on time, service type, and area." },
  { title: "Book with confidence", text: "Starting price, rating, and arrival estimate are clear beforehand." },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeNeed, setActiveNeed] = useState("Emergency");
  const [search, setSearch] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("power");
  const [selectedTime, setSelectedTime] = useState("now");
  const [selectedArea, setSelectedArea] = useState("nearby");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerSearch, setProviderSearch] = useState("");
  const [providers, setProviders] = useState([]);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");

  const filteredServices = services.filter((service) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      service.name.toLowerCase().includes(query) ||
      service.issue.toLowerCase().includes(query);
    const matchesNeed = service.tags.includes(activeNeed);
    return matchesSearch && (query || matchesNeed);
  });

  const recommendation = useMemo(() => {
    const serviceMap = {
      power: "Electrician",
      water: "Plumber",
      vehicle: "Mechanic",
      meal: "Cook",
      clean: "Cleaner",
      paint: "Painter",
      build: "Mistri",
      labour: "Labour",
    };
    const matched = services.find((service) => service.name === serviceMap[selectedIssue]);
    const urgency =
      selectedTime === "now" ? "Priority dispatch" : selectedTime === "today" ? "Same-day slot" : "Planned visit";
    const areaNote =
      selectedArea === "nearby" ? "near your current area" : selectedArea === "home" ? "for saved home address" : "for a custom address";
    return { ...matched, urgency, areaNote };
  }, [selectedArea, selectedIssue, selectedTime]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedProvider(null);
    setSelectedIssue(issueByServiceName[service.name] || "power");
    setBookingNote("");
    setBookingConfirmed(false);
  };

  const fetchProviders = async () => {
    setProviderLoading(true);
    setProviderError("");

    try {
      const params = new URLSearchParams();
      if (providerSearch) params.set("search", providerSearch);
      if (selectedService?.name) params.set("service", selectedService.name);

      const { data } = await api.get(`/providers?${params.toString()}`);
      setProviders(data.providers || []);
    } catch (err) {
      setProviderError(err.response?.data?.message || "Unable to load providers.");
    } finally {
      setProviderLoading(false);
    }
  };

  useEffect(() => {
    if (selectedArea === "home" && user?.addresses?.length > 0) {
      const address = user.addresses[0];
      setAddressLine(address.addressLine || "");
      setCity(address.city || "");
      setStateField(address.state || "");
      setPincode(address.pincode || "");
    }
  }, [selectedArea, user]);

  const handleConfirmBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedService) {
      setBookingError("Please choose a service first.");
      return;
    }

    if (!addressLine || !city || !stateField || !pincode) {
      setBookingError("Please provide complete address details.");
      return;
    }

    setBookingError("");
    setBookingLoading(true);

    try {
      await api.post("/bookings", {
        serviceType: selectedService.name,
        issue: selectedService.issue,
        details: bookingNote,
        providerId: selectedProvider?.id || selectedProvider?._id,
        bookingDate: bookingDate || undefined,
        location: {
          address: addressLine,
          city,
          state: stateField,
          pincode,
        },
      });

      setBookingConfirmed(true);
      setSelectedService(null);
      navigate("/requests");
    } catch (err) {
      setBookingError(err.response?.data?.message || "Unable to create request.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="overflow-hidden">
      <section className="relative bg-slate-950 px-4 py-12 text-white md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.86)),radial-gradient(circle_at_20%_18%,rgba(249,115,22,0.35),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(14,165,233,0.22),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-100">
              <FaShieldAlt />
              Trusted local help for home needs
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              When you're stuck with household work, call SevaSaathi.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Mechanic, electrician, plumber, cook, cleaner, painter, mason, and laborer - all in one place.
              Check arrival time, starting price, and rating first, then book with peace of mind.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={user ? "/" : "/register"}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-primary-600"
              >
                <FaCalendarCheck />
                {user ? "Find help now" : "Book local help"}
              </Link>
              <a
                href="tel:112"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15"
              >
                <FaPhoneAlt />
                Urgent help
              </a>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {comfortPoints.map((point) => (
                <div key={point} className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/10 p-3 text-sm font-semibold text-slate-200">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-primary-500" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 grid grid-cols-3 gap-3">
              {trustStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <p className="text-xl font-black md:text-2xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-300 md:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="rounded-2xl border border-white/15 bg-white p-4 text-slate-950 shadow-2xl transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-white md:p-6"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Seva Match</p>
                <h2 className="text-2xl font-black">Tell us your problem, get a helper</h2>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-100 text-xl text-primary-600">
                <FaSearch />
              </span>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">What help do you need?</span>
                <select
                  value={selectedIssue}
                  onChange={(event) => setSelectedIssue(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="power">Electricity, fan, wiring, or appliance</option>
                  <option value="water">Water leakage, tap, or bathroom</option>
                  <option value="vehicle">Vehicle breakdown or puncture</option>
                  <option value="meal">Home cooking or party catering</option>
                  <option value="clean">Cleaning or deep cleaning</option>
                  <option value="paint">Painting or waterproofing</option>
                  <option value="build">Mason for construction or repair</option>
                  <option value="labour">Laborer for house work or shifting</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">When do you need it?</span>
                  <select
                    value={selectedTime}
                    onChange={(event) => setSelectedTime(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="now">Now</option>
                    <option value="today">Today</option>
                    <option value="later">Later this week</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Where?</span>
                  <select
                    value={selectedArea}
                    onChange={(event) => setSelectedArea(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="nearby">Near me</option>
                    <option value="home">Saved home</option>
                    <option value="custom">Another address</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-950 p-5 text-white dark:bg-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-orange-200">Suggested helper</p>
                  <h3 className="mt-1 text-3xl font-black">{recommendation.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    For this job, {recommendation.name} is the best choice. {recommendation.urgency} {recommendation.areaNote}.
                    Estimated arrival: {recommendation.eta}.
                  </p>
                </div>
                <span className="text-3xl text-primary-500">{recommendation.icon}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <span className="rounded-lg bg-white/10 px-3 py-2">{recommendation.price}</span>
                <span className="rounded-lg bg-white/10 px-3 py-2">{recommendation.rating} rating</span>
                <span className="rounded-lg bg-white/10 px-3 py-2">{recommendation.demand}</span>
              </div>
              <button
                type="button"
                onClick={() => handleServiceSelect(recommendation)}
                className="mt-4 w-full rounded-lg bg-primary-500 px-4 py-3 text-sm font-black text-white transition hover:bg-primary-600"
              >
                Continue with {recommendation.name}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-primary-600">Search providers</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Find trusted helpers near you</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Search by name, company, or service and select the right provider before confirming your request.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchProviders}
              className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-3 text-sm font-black text-white transition hover:bg-primary-600"
            >
              Search providers
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Search by name or skill</span>
              <input
                value={providerSearch}
                onChange={(event) => setProviderSearch(event.target.value)}
                placeholder="e.g. plumber, electrician, Rahul"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Filter by service</span>
              <select
                value={selectedService?.name || ""}
                onChange={(event) => {
                  const service = services.find((item) => item.name === event.target.value);
                  setSelectedService(service || null);
                  setSelectedProvider(null);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">All services</option>
                {services.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {providerError && (
            <p className="mt-4 text-sm text-red-600">{providerError}</p>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {providerLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                Loading providers...
              </div>
            ) : providers.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                No providers found yet. Search by name or filter by service.
              </div>
            ) : (
              providers.map((provider) => (
                <article
                  key={provider._id}
                  className={`rounded-3xl border p-5 shadow-sm transition ${
                    selectedProvider?._id === provider._id
                      ? "border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-slate-900"
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-xl text-primary-600 dark:bg-slate-800">
                      {provider.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-slate-950 dark:text-white">{provider.name}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{provider.providerCompany || "Independent helper"}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p><strong>Services:</strong> {provider.servicesOffered?.join(", ") || "Not listed"}</p>
                    <p><strong>Experience:</strong> {provider.providerExperience || "Not specified"}</p>
                    <p>{provider.providerDescription || "No description added."}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProvider(provider)}
                    className="mt-4 w-full rounded-lg bg-primary-500 px-4 py-3 text-sm font-black text-white transition hover:bg-primary-600"
                  >
                    {selectedProvider?._id === provider._id ? "Selected" : "Select helper"}
                  </button>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-primary-600">Popular services</p>
            <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">What help do you need today?</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Service cards are kept simple so users can quickly understand which expert is right for which job.
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search: mason, plumber, cooking..."
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {quickNeeds.map((need) => (
            <button
              key={need}
              onClick={() => setActiveNeed(need)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition ${
                activeNeed === need
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-primary-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {need}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <article
              key={service.name}
              onClick={() => handleServiceSelect(service)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-400/50"
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleServiceSelect(service);
                }
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-100 text-xl text-primary-600">
                  {service.icon}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {service.demand}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">{service.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-400">{service.issue}</p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <FaClock className="text-primary-500" />
                  {service.eta}
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <FaStar className="text-primary-500" />
                  {service.rating}
                </span>
                <span className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{service.price}</span>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleServiceSelect(service);
                }}
                className="mt-5 w-full rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-black text-primary-600 transition hover:bg-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-orange-200"
              >
                Check nearby helpers
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-100 text-primary-600">
                <FaHome />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-primary-600">Human-first booking</p>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">App simple, work serious.</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Users won't see technical jargon or confusing forms. Just choose your problem, time, and location.
              SevaSaathi handles the rest with expert matching.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {bookingSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-black text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-10 transition-colors dark:border-slate-800 dark:bg-slate-900 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-white">
              <FaComments />
            </span>
            <div>
              <h3 className="font-black text-slate-950 dark:text-white">Clear communication</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Problem details reach the helper, so users don't have to explain repeatedly.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-white">
              <FaShieldAlt />
            </span>
            <div>
              <h3 className="font-black text-slate-950 dark:text-white">Trust-first cards</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Ratings, starting price, and service type stay visible so decisions feel clear.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-white">
              <FaCarSide />
            </span>
            <div>
              <h3 className="font-black text-slate-950 dark:text-white">Construction-ready</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">Mason and laborer support is now visible for house building, repair, and material work.</p>
            </div>
          </div>
        </div>
      </section>

      {selectedService && (
        <div className="fixed inset-0 z-[80] flex items-end bg-slate-950/60 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-orange-100 text-xl text-primary-600">
                  {selectedService.icon}
                </span>
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-primary-600">Nearby helper selected</p>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">{selectedService.name}</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300"
                aria-label="Close booking panel"
              >
                <FaTimes />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl text-green-700">
                  <FaCheckCircle />
                </span>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Request is ready</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {selectedService.name} request is ready. Once the booking API is connected, this action will create a real booking.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
                  <span className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
                    <FaClock className="mx-auto mb-1 text-primary-500" />
                    {selectedService.eta}
                  </span>
                  <span className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
                    <FaStar className="mx-auto mb-1 text-primary-500" />
                    {selectedService.rating}
                  </span>
                  <span className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
                    {selectedService.price}
                  </span>
                </div>

                {selectedProvider && (
                  <div className="mt-5 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-slate-900 dark:border-primary-500 dark:bg-slate-900/70 dark:text-white">
                    <p className="font-bold text-slate-950 dark:text-white">Selected helper</p>
                    <p className="mt-2">{selectedProvider.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{selectedProvider.providerCompany || "Independent provider"}</p>
                    <p className="mt-2 text-sm">Services: {selectedProvider.servicesOffered?.join(", ") || "Not listed"}</p>
                  </div>
                )}

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">Preferred booking date</span>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(event) => setBookingDate(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">
                    Tell us more about your problem
                  </span>
                  <textarea
                    value={bookingNote}
                    onChange={(event) => setBookingNote(event.target.value)}
                    rows={4}
                    placeholder={
                      selectedService.name === "Plumber"
                        ? "Example: Kitchen sink is leaking..."
                        : "Example: What's the job, address with landmark, timing..."
                    }
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </label>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">Address line</span>
                    <input
                      value={addressLine}
                      onChange={(event) => setAddressLine(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Flat, building, street, landmark"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">City</span>
                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">State</span>
                    <input
                      value={stateField}
                      onChange={(event) => setStateField(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700 dark:text-slate-200">Pincode</span>
                    <input
                      value={pincode}
                      onChange={(event) => setPincode(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                </div>

                {bookingError && (
                  <p className="mt-3 text-sm text-red-600">{bookingError}</p>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="flex-1 rounded-lg bg-primary-500 px-4 py-3 text-sm font-black text-white transition hover:bg-primary-600 disabled:opacity-60"
                  >
                    {bookingLoading ? "Creating request..." : "Confirm request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-200"
                  >
                    Choose another
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
};

export default Home;
