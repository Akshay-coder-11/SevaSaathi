import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/auth/stats"),
          api.get("/auth/users"),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data.users);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-50 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-black">Platform overview</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Monitor user registrations, provider count, and booking progress from a single admin view.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            Fetching dashboard statistics...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-700/30 dark:bg-red-950/40">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-xl font-bold">User counts</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total users</p>
                    <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{stats.totalUsers}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Customers</p>
                    <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{stats.customerCount}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Providers</p>
                    <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{stats.providerCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-xl font-bold">Booking progress</h2>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total bookings</p>
                    <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{stats.totalBookings}</p>
                  </div>
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <div key={status} className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950/70">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{status.replace(/_/g, " ")}</p>
                        <p className="text-2xl font-black text-slate-950 dark:text-white">{count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Registered users</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    View all registered customers, providers, and admins.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
                  {users.length} users
                </span>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[720px] divide-y divide-slate-200 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
                  <thead className="bg-slate-50 text-left uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Active</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/80">
                        <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{user.name}</td>
                        <td className="px-4 py-4 capitalize text-slate-600 dark:text-slate-300">{user.role}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{user.phone}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{user.isActive ? "Yes" : "No"}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
