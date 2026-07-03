import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (formData) => {
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/forgot-password", formData);
      setMessage(data.message || "Reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
        className="w-full max-w-md rounded-2xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-200/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
      >
        <p className="mb-2 text-sm font-black uppercase tracking-wide text-primary-600">Account recovery</p>
        <h1 className="mb-1 text-3xl font-black text-slate-950 dark:text-white">Forgot Password</h1>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-950 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
