import { useState } from "react";
import { createCustomer } from "../lib/db";
import { useNavigate } from "react-router-dom";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("email"); // register with email or phone
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (mode === "email" && !form.email) {
      setError("Email is required.");
      return;
    }
    if (mode === "phone" && !form.phone) {
      setError("Phone number is required.");
      return;
    }

    try {
      const c = createCustomer({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: mode === "email" ? form.email : null,
        phone: mode === "phone" ? form.phone : null,
        password: form.password,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate(`/${c.subdomain}/login`), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f5f7fa",
    padding: "20px",
  };

  const cardStyle = {
    background: "#fff",
    padding: "40px 35px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    maxWidth: "420px",
    width: "100%",
    transition: "all 0.3s ease-in-out",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    marginBottom: "25px",
    textAlign: "center",
    color: "#2c3e50",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#444",
  };

  const inputStyle = {
    padding: "12px 14px",
    marginTop: "6px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
  };

  const buttonStyle = {
    padding: "12px",
    background: "linear-gradient(135deg, #4f46e5, #6d28d9)",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: "10px",
  };

  const toggleStyle = {
    display: "flex",
    justifyContent: "space-around",
    margin: "20px 0",
    padding: "10px",
    background: "#f0f4f8",
    borderRadius: "10px",
  };

  const messageStyle = {
    textAlign: "center",
    fontSize: "0.9rem",
    marginTop: "10px",
  };

  const hintStyle = {
    textAlign: "center",
    fontSize: "0.9rem",
    marginTop: "15px",
    color: "#555",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Register New Customer</h1>

        <div style={toggleStyle}>
          <label>
            <input
              type="radio"
              value="email"
              checked={mode === "email"}
              onChange={() => setMode("email")}
            />
            Register with Email
          </label>
          <label>
            <input
              type="radio"
              value="phone"
              checked={mode === "phone"}
              onChange={() => setMode("phone")}
            />
            Register with Phone
          </label>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>
            First Name
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Last Name
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Username (your business subdomain)
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. roopban"
              style={inputStyle}
            />
          </label>

          {mode === "email" ? (
            <label style={labelStyle}>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          ) : (
            <label style={labelStyle}>
              Phone
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          )}

          <label style={labelStyle}>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          <button type="submit" style={buttonStyle}>
            Register
          </button>

          {error && <p style={{ ...messageStyle, color: "#e63946" }}>{error}</p>}
          {success && <p style={{ ...messageStyle, color: "#2a9d8f" }}>{success}</p>}
        </form>

        {form.username && (
          <p style={hintStyle}>
            Your login URL will be: <code>/{form.username}/login</code>
          </p>
        )}
      </div>
    </div>
  );
}
