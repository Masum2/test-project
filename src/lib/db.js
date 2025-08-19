// lib/db.js

const STORAGE_KEY = "mt_customers_v2"; // version updated
const SESSION_KEY = "mt_sessions_v1";

export const THEMES = [
  { id: "theme1", name: "Theme 1", image1: "/themes/theme1-1.jpg" },
  { id: "theme2", name: "Theme 2", image1: "/themes/theme2-1.jpg" },
];

// --- utils
function readCustomers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse customers:", e);
    return [];
  }
}
function writeCustomers(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function readSessions() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to parse sessions:", e);
    return {};
  }
}
function writeSessions(map) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(map));
}

// --- seed demo
export function seedOnce() {
  const existing = readCustomers();
  if (existing.length === 0) {
    const demo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      firstName: "Demo",
      lastName: "Business",
      username: "demo",
      name: "Demo Business",
      email: "demo@business.com",
      phone: "0170000000",
      subdomain: "demo",
      password: "1234",
      activeThemeId: null,
      businessPhone: "0170000000",
      businessAddress: "Demo Street, Dhaka",
      city: "Dhaka",
      state: "Dhaka",
      country: "Bangladesh",
      businessLogo: null,
      createdAt: new Date().toISOString(),
    };
    writeCustomers([demo]);
  }
}

// --- CRUD
export function getCustomers() {
  return readCustomers();
}
export function findBySubdomain(subdomain) {
  return readCustomers().find((c) => c.subdomain === subdomain);
}
export function createCustomer({
  firstName,
  lastName,
  username,
  email,
  phone,
  password,
  businessPhone,
  businessAddress,
  city,
  state,
  country,
  businessLogo,
}) {
  const list = readCustomers();
  if (!firstName || !lastName || !username || !password) {
    throw new Error("Required fields missing.");
  }
  if (list.some((c) => c.subdomain === username.toLowerCase())) {
    throw new Error("This username/subdomain is already in use.");
  }

  const newCustomer = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    firstName,
    lastName,
    username,
    name: firstName + " " + lastName,
    email: email || null,
    phone: phone || null,
    subdomain: username.toLowerCase(),
    password,
    activeThemeId: null,
    businessPhone: businessPhone || null,
    businessAddress: businessAddress || null,
    city: city || null,
    state: state || null,
    country: country || null,
    businessLogo: businessLogo || null,
    createdAt: new Date().toISOString(),
  };
  list.push(newCustomer);
  writeCustomers(list);
  return newCustomer;
}

// --- Auth & Sessions
export function authenticate(subdomain, identifier, password) {
  const c = readCustomers().find(
    (x) =>
      x.subdomain === subdomain &&
      (x.email === identifier || x.phone === identifier) &&
      x.password === password
  );
  return !!c;
}

export function loginTenant(subdomain, emailOrPhone) {
  const sessions = readSessions();
  sessions[subdomain] = { emailOrPhone, loggedInAt: Date.now() };
  writeSessions(sessions);
}
export function logoutTenant(subdomain) {
  const sessions = readSessions();
  delete sessions[subdomain];
  writeSessions(sessions);
}
export function isTenantLoggedIn(subdomain) {
  const sessions = readSessions();
  return Boolean(sessions[subdomain]);
}

// --- Themes
export function getActiveTheme(subdomain) {
  const c = findBySubdomain(subdomain);
  return c?.activeThemeId ?? null;
}
export function setActiveTheme(subdomain, themeId) {
  const list = readCustomers();
  const idx = list.findIndex((c) => c.subdomain === subdomain);
  if (idx === -1) return;
  list[idx].activeThemeId = themeId;
  writeCustomers(list);
}
