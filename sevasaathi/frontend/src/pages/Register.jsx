import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");
  const selectedRole = watch("role", "customer");

  const onSubmit = async (formData) => {
    setServerError("");
    setSubmitting(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        providerDescription: formData.providerDescription,
        providerExperience: formData.providerExperience,
        providerCompany: formData.providerCompany,
        servicesOffered: formData.servicesOffered,
      });
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#f8fafc_45%,#e0f2fe_100%)] px-4 py-10 transition-colors dark:bg-none dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-2xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-200/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
      >
        <p className="mb-2 text-sm font-black uppercase tracking-wide text-primary-600">Join the network</p>
        <h1 className="mb-1 text-3xl font-black text-slate-950 dark:text-white">Create your account</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">Join SevaSaathi as a customer or provider.</p>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Full Name</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              {...register("phone", {
                required: "Phone number is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid Indian mobile number" },
              })}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">I am a</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              defaultValue="customer"
              {...register("role")}
            >
              <option value="customer">Customer looking for services</option>
              <option value="provider">Service Provider</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {selectedRole === "provider" && (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Provider details</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Services offered</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="e.g. Plumbing, electrician, carpenter"
                  {...register("servicesOffered", { required: "Please list your services" })}
                />
                {errors.servicesOffered && <p className="text-red-500 text-sm mt-1">{errors.servicesOffered.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Experience</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="e.g. 5 years service experience"
                  {...register("providerExperience", { required: "Please add your experience" })}
                />
                {errors.providerExperience && <p className="text-red-500 text-sm mt-1">{errors.providerExperience.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Company or brand</label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="e.g. Raaj Electricians"
                  {...register("providerCompany")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Service description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Describe your expertise, availability, and service area"
                  {...register("providerDescription", { required: "Please describe your services" })}
                />
                {errors.providerDescription && <p className="text-red-500 text-sm mt-1">{errors.providerDescription.message}</p>}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-950 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
