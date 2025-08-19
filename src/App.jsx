import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import TenantLogin from "./pages/TenantLogin";
import TenantDashboard from "./pages/TenantDashboard";
import ThemeAppearance from "./pages/ThemeAppearance";
import RegisterCustomer from "./pages/RegisterCustomer";
import { isTenantLoggedIn } from "./lib/db";
import "./pages/styles.css";

function RequireAuth({ children }) {
  const { tenant } = useParams();
  const ok = isTenantLoggedIn(tenant);
  if (!ok) {
    return <Navigate to={`/${tenant}/login`} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterCustomer />} />
        <Route path="/super-new-customer" element={<SuperAdmin />} />
        <Route path="/:tenant/login" element={<TenantLogin />} />
        <Route
          path="/:tenant/dashboard"
          element={
            <RequireAuth>
              <TenantDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/:tenant/appearance/themes"
          element={
            <RequireAuth>
              <ThemeAppearance />
            </RequireAuth>
          }
        />
        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
