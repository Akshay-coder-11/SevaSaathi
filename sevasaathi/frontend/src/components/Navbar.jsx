import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoon, FaSun, FaTools, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("sevasaathi_theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("dark", isDarkMode);
    document.body.dataset.theme = theme;

    try {
      localStorage.setItem("sevasaathi_theme", theme);
    } catch {
      // Ignore storage errors; the visual toggle should still work.
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 text-slate-950 dark:text-white">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-500 text-white shadow-sm">
            <FaTools />
          </span>
          <span>
            <span className="block text-lg font-black leading-5">SevaSaathi</span>
            <span className="hidden items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 sm:flex">
              <FaMapMarkerAlt className="text-primary-500" />
              Smart local services
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setIsDarkMode((value) => !value)}
            className={`flex h-10 w-[118px] items-center rounded-full border p-1 transition ${
              isDarkMode
                ? "justify-end border-slate-700 bg-slate-900 text-white"
                : "justify-start border-orange-200 bg-orange-50 text-primary-600"
            }`}
            aria-label={isDarkMode ? "Switch to bright mode" : "Switch to dark mode"}
            aria-pressed={isDarkMode}
            title={isDarkMode ? "Bright mode" : "Dark mode"}
          >
            <span className="inline-flex h-8 items-center gap-2 rounded-full bg-white px-3 text-xs font-black text-slate-950 shadow-sm">
              {isDarkMode ? <FaMoon /> : <FaSun />}
              {isDarkMode ? "Dark" : "Bright"}
            </span>
          </button>
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link
                  to="/admin"
                  className="items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Admin dashboard
                </Link>
              ) : (
                <Link
                  to="/requests"
                  className="items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  My requests
                </Link>
              )}
              <Link
                to="/profile"
                className="items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <FaUserCircle className="text-primary-500" />
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-primary-600 dark:text-slate-200">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
