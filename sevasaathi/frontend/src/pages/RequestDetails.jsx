import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaClock, FaCheckCircle } from "react-icons/fa";
import api from "../services/api";

const statusStyles = {
  pending: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
  assigned: "text-sky-600 bg-sky-100 dark:bg-sky-900/40",
  on_the_way: "text-blue-700 bg-blue-100 dark:bg-blue-900/40",
  arrived: "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40",
  completed: "text-green-700 bg-emerald-100 dark:bg-emerald-900/40",
  cancelled: "text-red-700 bg-red-100 dark:bg-red-900/40",
};

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/bookings/${id}`);
        setBooking(data.booking);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load request details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-50 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500"
        >
          <FaArrowLeft /> Back to requests
        </button>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            Loading request details...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-700/30 dark:bg-red-950/40">
            {error}
          </div>
        ) : (
          booking && (
            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Request overview</p>
                    <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{booking.serviceType}</h1>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-sm font-bold ${statusStyles[booking.status]}`}>
                    {booking.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <h2 className="font-semibold text-slate-900 dark:text-white">Issue details</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{booking.issue || "No extra details"}</p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{booking.details || "No description provided."}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <h2 className="font-semibold text-slate-900 dark:text-white">Customer location</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{booking.location.address}</p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{booking.location.city}, {booking.location.state} {booking.location.pincode}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <FaUser className="text-primary-500" />
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Provider details</h2>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Name</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{booking.providerName || booking.provider?.name || "Not assigned yet"}</p>
                  </div>
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Phone</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                      {booking.status !== "pending" && booking.providerPhone
                        ? booking.providerPhone
                        : "Visible once provider accepts the request"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Arrival</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{booking.estimatedArrival || "TBD"}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Provider current location</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{booking.providerLocation?.address || "Not available"}</p>
                  {booking.providerLocation?.city && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{booking.providerLocation.city}, {booking.providerLocation.state}</p>
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <FaClock className="text-primary-500" />
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Progress timeline</h2>
                </div>
                <div className="mt-5 space-y-4">
                  {booking.updates?.map((update, index) => (
                    <div key={index} className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-primary-500" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{update.status.replace(/_/g, " ")}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(update.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{update.message || "No description added."}</p>
                      {update.location?.address && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Location: {update.location.address}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-primary-500" />
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Need help?</h2>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  If you want to contact the helper directly, use the phone number above. For urgent issues, call our support line.
                </p>
              </section>
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default RequestDetails;
