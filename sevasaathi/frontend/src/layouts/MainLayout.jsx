import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// Shared layout wrapper: Navbar + page content via <Outlet />.
const MainLayout = () => {
  return (
    <div className="app-shell min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
