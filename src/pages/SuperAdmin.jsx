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
// handleChange for file
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((s) => ({ ...s, businessLogo: reader.result }));
    };
    reader.readAsDataURL(file); // Base64 string
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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
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
      <main style={{ flex: 1, padding: 20, background: "#F3F4F6" }}>
        <section id="create" style={{ background: "#fff", padding: 20, borderRadius: 8, marginBottom: 30 }}>
          <h1 style={{ marginBottom: 20 }}>Create Customer</h1>
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15 }}>
              <label>
                First Name
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                Last Name
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                Username/Subdomain
                <input
                  name="username"
                  placeholder="e.g. roopban"
                  value={form.username}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="owner@business.com"
                  value={form.email}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                Phone
                <input
                  name="phone"
                  placeholder="017XXXXXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                Business Phone
                <input
                  name="businessPhone"
                  placeholder="Business Phone"
                  value={form.businessPhone}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                Address
                <input
                  name="businessAddress"
                  placeholder="Address"
                  value={form.businessAddress}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                City
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                State
                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
              <label>
                Country
                <input
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
          <label>
  Business Logo
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
  />
</label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{ width: "100%", padding: 6, marginTop: 4 }}
                />
              </label>
            </div>
            <button type="submit" style={{ marginTop: 20, padding: "10px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
              Create Customer
            </button>
            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}
          </form>
        </section>

        <section id="customers" style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
          <h2 style={{ marginBottom: 15 }}>All Customers</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#E5E7EB", textAlign: "left" }}>
                  <th style={{ padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Subdomain</th>
                  <th style={{ padding: 8 }}>Email</th>
                  <th style={{ padding: 8 }}>Phone</th>
                  <th style={{ padding: 8 }}>Business Phone</th>
                  <th style={{ padding: 8 }}>Address</th>
                  <th style={{ padding: 8 }}>City</th>
                  <th style={{ padding: 8 }}>State</th>
                  <th style={{ padding: 8 }}>Country</th>
                  <th style={{ padding: 8 }}>Logo</th>
                  <th style={{ padding: 8 }}>Login</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 8 }}>{c.name}</td>
                    <td style={{ padding: 8 }}>{c.subdomain}</td>
                    <td style={{ padding: 8 }}>{c.email}</td>
                    <td style={{ padding: 8 }}>{c.phone}</td>
                    <td style={{ padding: 8 }}>{c.businessPhone || "-"}</td>
                    <td style={{ padding: 8 }}>{c.businessAddress || "-"}</td>
                    <td style={{ padding: 8 }}>{c.city || "-"}</td>
                    <td style={{ padding: 8 }}>{c.state || "-"}</td>
                    <td style={{ padding: 8 }}>{c.country || "-"}</td>
<td style={{ padding: 8 }}>
  {c.businessLogo ? (
    <img src={c.businessLogo} alt="Logo" style={{ width: 50, borderRadius: 5 }} />
  ) : (
    "-"
  )}
</td>

                    <td style={{ padding: 8 }}>
                      <Link to={`/${c.subdomain}/login`} style={{ color: "#2563EB" }}>
                        /{c.subdomain}/login
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 8 }}>
            Demo seed আছে: <code>demo</code> / <code>demo@business.com</code> /{" "}
            <code>1234</code>
          </p>
        </section>
      </main>
    </div>
  );
}
