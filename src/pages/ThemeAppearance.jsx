import { Link, useParams } from "react-router-dom";
import { THEMES, getActiveTheme, setActiveTheme, findBySubdomain, logoutTenant } from "../lib/db";
import "./styles.css";

export default function ThemeAppearance() {
  const { tenant } = useParams();
  const customer = findBySubdomain(tenant);
  const activeId = getActiveTheme(tenant);

  if (!customer) {
    return (
      <div className="page">
        <p className="error">Unknown tenant.</p>
      </div>
    );
  }

  const handleActivate = (id) => {
    setActiveTheme(tenant, id);
    window.location.href = `/${tenant}/appearance/themes`;
  };

  const handleDeactivate = () => {
    setActiveTheme(tenant, null);
    window.location.href = `/${tenant}/appearance/themes`;
  };

  const handleLogout = () => {
    logoutTenant(tenant);
    window.location.href = `/${tenant}/login`;
  };

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
              <button className="link" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="card">
          <h2>Appearance → Themes</h2>
          <p>Active Theme: <strong>{activeId || "None"}</strong></p>

          <div className="theme-grid">
            {THEMES.map((t) => {
              const isActive = t.id === activeId;
              return (
                <div key={t.id} className={`theme-card ${isActive ? "active" : ""}`}>
                  {/* Theme images */}
                  <div className="theme-images">
                    <img src={t.image1} alt={t.name} />
                 
                  </div>

                  <div className="theme-title">{t.name}</div>
                  <div className="theme-actions">
                    {isActive ? (
                      <button className="btn-outline" onClick={handleDeactivate}>Deactivate</button>
                    ) : (
                      <button className="btn" onClick={() => handleActivate(t.id)}>Activate</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
