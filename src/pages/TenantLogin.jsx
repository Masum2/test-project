import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { authenticate, loginTenant, findBySubdomain } from "../lib/db";
import "./styles.css";

export default function TenantLogin() {
  const { tenant } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const customer = findBySubdomain(tenant);

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!customer) {
      setError("Unknown tenant/subdomain.");
      return;
    }

    const ok = authenticate(tenant, form.identifier, form.password);
    if (ok) {
      loginTenant(tenant, form.identifier);
      navigate(`/${tenant}/dashboard`);
    } else {
      setError("Invalid email/phone or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Login — {tenant}</h1>

          {!customer && (
            <p className="error">No customer exists with subdomain '{tenant}'.</p>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Email or Phone
              <input
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••"
              />
            </label>
            <button className="btnn" disabled={!customer}>Login</button>
            {error && <p className="error">{error}</p>}
          </form>

          <p className="login-footer">
            Go to <Link to="/super-new-customer">Super Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
