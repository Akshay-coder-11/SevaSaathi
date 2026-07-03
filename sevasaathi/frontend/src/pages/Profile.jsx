import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [providerDescription, setProviderDescription] = useState("");
  const [providerExperience, setProviderExperience] = useState("");
  const [providerCompany, setProviderCompany] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    if (user?.role === "provider") {
      setProviderDescription(user.providerDescription || "");
      setProviderExperience(user.providerExperience || "");
      setProviderCompany(user.providerCompany || "");
      setServicesOffered((user.servicesOffered || []).join(", ") || "");
    }
  }, [user]);

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return "-";
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(user.createdAt));
  }, [user]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-50 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-primary-500 via-sky-500 to-cyan-500 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-100/80">My Profile</p>
              <h1 className="mt-2 text-3xl font-black">{user?.name || "User"}</h1>
            </div>
            <div className="rounded-3xl bg-white/10 px-4 py-3 text-right text-sm sm:text-base">
              <p className="text-slate-200/85">Role</p>
              <p className="mt-1 text-xl font-semibold capitalize">{user?.role || "customer"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm dark:bg-slate-950/70">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Email</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{user?.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm dark:bg-slate-950/70">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Phone</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{user?.phone || "-"}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm dark:bg-slate-950/70">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Member since</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{joinedDate}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 shadow-sm dark:bg-slate-950/70">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Status</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                {user?.isActive ? "Active" : "Suspended"}
              </p>
            </div>
          </div>
        </section>

        {user?.role === "provider" && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Provider profile</p>
                <h2 className="mt-2 text-2xl font-bold">Service details</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Services offered</label>
                <input
                  value={servicesOffered}
                  onChange={(event) => setServicesOffered(event.target.value)}
                  placeholder="e.g. plumbing, electrician, carpenter"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Experience</label>
                <input
                  value={providerExperience}
                  onChange={(event) => setProviderExperience(event.target.value)}
                  placeholder="e.g. 5 years"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Company / brand</label>
                <input
                  value={providerCompany}
                  onChange={(event) => setProviderCompany(event.target.value)}
                  placeholder="e.g. Raaj Electricians"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
                <textarea
                  value={providerDescription}
                  onChange={(event) => setProviderDescription(event.target.value)}
                  rows={4}
                  placeholder="Describe your skills, service area, and availability"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              {saveError && <p className="text-sm text-red-600">{saveError}</p>}
              {saveSuccess && <p className="text-sm text-emerald-600">{saveSuccess}</p>}
              <button
                type="button"
                onClick={async () => {
                  setSaving(true);
                  setSaveError("");
                  setSaveSuccess("");
                  try {
                    await updateUser({
                      providerDescription,
                      providerExperience,
                      providerCompany,
                      servicesOffered,
                    });
                    setSaveSuccess("Provider profile updated successfully.");
                  } catch (error) {
                    setSaveError(error.response?.data?.message || "Unable to save provider details.");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="mt-4 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save provider details"}
              </button>
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Saved profile details</p>
              <h2 className="mt-2 text-2xl font-bold">Contact & address</h2>
            </div>
          </div>

          <div className="space-y-4">
            {user?.addresses?.length ? (
              user.addresses.map((address) => (
                <div
                  key={address._id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{address.label}</p>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {address.isDefault ? "Default" : "Saved"}
                    </p>
                  </div>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">{address.addressLine}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300">
                <p className="font-semibold">No saved addresses yet.</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Add your address when you make a service request so it appears here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
