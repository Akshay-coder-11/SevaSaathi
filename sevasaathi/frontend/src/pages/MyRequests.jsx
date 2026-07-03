import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCircle, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaHourglassHalf } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  pending: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
  assigned: "text-sky-600 bg-sky-100 dark:bg-sky-900/40",
  on_the_way: "text-blue-700 bg-blue-100 dark:bg-blue-900/40",
  arrived: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40",
  completed: "text-green-700 bg-emerald-100 dark:bg-emerald-900/40",
  cancelled: "text-red-700 bg-red-100 dark:bg-red-900/40",
};

const MyRequests = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/bookings/my-requests");
        setBookings(data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-50 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Your requests</p>
              <h1 className="mt-2 text-3xl font-black">Track your service progress</h1>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <FaUser /> My profile
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Follow where your assigned helper is, see phone contact, location, and status updates for each request.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            Loading your requests...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-700/30 dark:bg-red-950/40">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <p className="text-lg font-semibold">No requests yet.</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Book a helper from the home page to see tracking details here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <article key={booking._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{booking.serviceType}</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{booking.issue || "Service request"}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{booking.details || "No additional details provided."}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-2 text-sm font-bold ${statusStyles[booking.status] || "text-slate-700 bg-slate-100 dark:bg-slate-800"}`}>
                      {booking.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{new Date(booking.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Customer address</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{booking.location.address}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{booking.location.city}, {booking.location.state} {booking.location.pincode}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Assigned helper</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{booking.providerName || booking.provider?.name || "Not assigned yet"}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{booking.providerPhone || booking.provider?.phone || "Waiting for assignment"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Estimated arrival</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{booking.estimatedArrival || "TBD"}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Provider current location</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {booking.providerLocation?.address || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-200 p-6 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    <FaMapMarkerAlt /> Status timeline
                  </div>
                  <div className="space-y-3">
                    {booking.updates?.map((update, index) => (
                      <div key={index} className="rounded-3xl bg-slate-50 p-4 text-sm dark:bg-slate-950/70">
                        <div className="flex items-center gap-3">
                          <FaCircle className="text-primary-500" />
                          <p className="font-semibold text-slate-900 dark:text-white">{update.status.replace(/_/g, " ")}</p>
                          <span className="text-slate-500 dark:text-slate-400">{new Date(update.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">{update.message || "Status updated."}</p>
                        {update.location?.address && (
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Location: {update.location.address}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm dark:bg-slate-900">
                    <FaPhoneAlt className="text-primary-500" />
                    Support: 112
                  </span>
                  <Link
                    to={`/requests/${booking._id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
                  >
                    View details <FaArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyRequests;
