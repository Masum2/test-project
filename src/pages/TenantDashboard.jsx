import { Link, useParams } from "react-router-dom";
import { findBySubdomain, getActiveTheme, logoutTenant, THEMES } from "../lib/db";
import "./styles.css";

export default function TenantDashboard() {
  const { tenant } = useParams();
  const customer = findBySubdomain(tenant);
  const activeId = getActiveTheme(tenant);

  if (!customer) {
    return (
      <div className="page">
        <p className="error">
          Unknown tenant. Try <Link to="/super-new-customer">Super Admin</Link>
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    logoutTenant(tenant);
    window.location.href = `/${tenant}/login`;
  };

  // Find the active theme object
  const activeTheme = THEMES.find((t) => t.id === activeId);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>{customer.name}</h2>
        <nav>
          <ul>
            <li>
              <Link to={`/${tenant}/dashboard`}>Dashboard</Link>
            </li>
            <li>
              <Link to={`/${tenant}/appearance/themes`}>Themes</Link>
            </li>
            <li>
              <button className="link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="card">
          <h2>Welcome, {customer.name}</h2>
          <p>
            Subdomain: <code>{tenant}</code>
          </p>
          <p>
            Active Theme: <strong>{activeTheme ? activeTheme.name : "None"}</strong>
          </p>

          {/* Display theme images if available */}
          {activeTheme && (
            <div className="theme-images-dashboard">
              <img src={activeTheme.image1} alt={activeTheme.name} />
              
            </div>
          )}

          {/* <p style={{ marginTop: 12 }}>
            Go to{" "}
            <Link to={`/${tenant}/appearance/themes`}>
              Appearance → Themes
            </Link>{" "}
            to change the theme.
          </p> */}
        </div>
      </main>
    </div>
  );
}
