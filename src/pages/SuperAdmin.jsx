import { useEffect, useState } from "react";
import { createCustomer, getCustomers, seedOnce } from "../lib/db";
import { Link } from "react-router-dom";

export default function SuperAdmin() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    businessPhone: "",
    businessAddress: "",
    city: "",
    state: "",
    country: "",
    businessLogo: null,
    password: "",
  });
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    seedOnce();
    setCustomers(getCustomers());
  }, []);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    const { name, value, files } = e.target;
    if (name === "businessLogo") {
      setForm((s) => ({ ...s, businessLogo: files[0] }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((s) => ({ ...s, businessLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    try {
      const c = createCustomer(form);
      setCustomers(getCustomers());
      setSuccess(`Customer '${c.name}' created! Login: /${c.subdomain}/login`);
      setForm({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        businessPhone: "",
        businessAddress: "",
        city: "",
        state: "",
        country: "",
        businessLogo: null,
        password: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#111827", color: "#fff", padding: 20 }}>
        <h2 style={{ marginBottom: 20 }}>Super Admin</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: 10 }}>
              <a href="#create" style={{ color: "#fff", textDecoration: "none" }}>Create Customer</a>
            </li>
            <li>
              <a href="#customers" style={{ color: "#fff", textDecoration: "none" }}>All Customers</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 30, background: "#F9FAFB" }}>
        <section id="create" style={{ background: "#fff", padding: 30, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 30 }}>
          <h1 style={{ marginBottom: 25, fontSize: "1.5rem", fontWeight: "600", color: "#111827" }}>Create Customer</h1>
          
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {[
                { label: "First Name", name: "firstName", placeholder: "John" },
                { label: "Last Name", name: "lastName", placeholder: "Doe" },
                { label: "Username/Subdomain", name: "username", placeholder: "e.g. roopban" },
                { label: "Email", name: "email", type: "email", placeholder: "owner@business.com" },
                { label: "Phone", name: "phone", placeholder: "017XXXXXXXX" },
                { label: "Business Phone", name: "businessPhone", placeholder: "Business Phone" },
                { label: "Address", name: "businessAddress", placeholder: "123 Business St." },
                { label: "City", name: "city", placeholder: "Dhaka" },
                { label: "State", name: "state", placeholder: "Dhaka" },
                { label: "Country", name: "country", placeholder: "Bangladesh" },
              ].map((field) => (
                <label key={field.name} style={{ display: "flex", flexDirection: "column", fontSize: "0.9rem", color: "#374151" }}>
                  {field.label}
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    style={{
                      marginTop: 6,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #D1D5DB",
                      outline: "none",
                      transition: "0.2s",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #2563EB")}
                    onBlur={(e) => (e.target.style.border = "1px solid #D1D5DB")}
                  />
                </label>
              ))}

              {/* File Input */}
              <label style={{ display: "flex", flexDirection: "column", fontSize: "0.9rem", color: "#374151" }}>
                Business Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginTop: 6 }}
                />
              </label>

              {/* Password */}
              <label style={{ display: "flex", flexDirection: "column", fontSize: "0.9rem", color: "#374151" }}>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    marginTop: 6,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #D1D5DB",
                    outline: "none",
                    transition: "0.2s",
                  }}
                  onFocus={(e) => (e.target.style.border = "1px solid #2563EB")}
                  onBlur={(e) => (e.target.style.border = "1px solid #D1D5DB")}
                />
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                marginTop: 25,
                padding: "12px 24px",
                background: "#2563EB",
                color: "#fff",
                fontWeight: "500",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#1E40AF")}
              onMouseOut={(e) => (e.target.style.background = "#2563EB")}
            >
              Create Customer
            </button>

            {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: 12 }}>{success}</p>}
          </form>
        </section>

        {/* Customers List */}
        <section id="customers" style={{ background: "#fff", padding: 25, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <h2 style={{ marginBottom: 15, fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>All Customers</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F3F4F6", textAlign: "left" }}>
                  <th style={{ padding: 10 }}>Name</th>
                  <th style={{ padding: 10 }}>Subdomain</th>
                  <th style={{ padding: 10 }}>Email</th>
                  <th style={{ padding: 10 }}>Phone</th>
                  <th style={{ padding: 10 }}>Business Phone</th>
                  <th style={{ padding: 10 }}>Address</th>
                  <th style={{ padding: 10 }}>City</th>
                  <th style={{ padding: 10 }}>State</th>
                  <th style={{ padding: 10 }}>Country</th>
                  <th style={{ padding: 10 }}>Logo</th>
                  <th style={{ padding: 10 }}>Login</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <td style={{ padding: 10 }}>{c.name}</td>
                    <td style={{ padding: 10 }}>{c.subdomain}</td>
                    <td style={{ padding: 10 }}>{c.email}</td>
                    <td style={{ padding: 10 }}>{c.phone}</td>
                    <td style={{ padding: 10 }}>{c.businessPhone || "-"}</td>
                    <td style={{ padding: 10 }}>{c.businessAddress || "-"}</td>
                    <td style={{ padding: 10 }}>{c.city || "-"}</td>
                    <td style={{ padding: 10 }}>{c.state || "-"}</td>
                    <td style={{ padding: 10 }}>{c.country || "-"}</td>
                    <td style={{ padding: 10 }}>
                      {c.businessLogo ? (
                        <img src={c.businessLogo} alt="Logo" style={{ width: 50, borderRadius: 6 }} />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={{ padding: 10 }}>
                      <Link to={`/${c.subdomain}/login`} style={{ color: "#2563EB", textDecoration: "none" }}>
                        /{c.subdomain}/login
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 10, fontSize: "0.9rem", color: "#4B5563" }}>
            Demo seed আছে: <code>demo</code> / <code>demo@business.com</code> / <code>1234</code>
          </p>
        </section>
      </main>
    </div>
  );
}
