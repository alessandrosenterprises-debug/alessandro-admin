import { useState, useEffect } from "react";

const BUSINESSES = [
  { id: "soft-loans", name: "Alessandro Soft Loans", icon: "💰", color: "#1a3a5c" },
  { id: "mobile-money", name: "Alessandro Mobile Money", icon: "📱", color: "#0d6e4f" },
  { id: "barbershop", name: "Alessandro Classic Barbershop", icon: "✂️", color: "#7c3a2a" },
  { id: "fashion", name: "Alessandro Elite Fashion", icon: "👔", color: "#4a1a6e" },
  { id: "tech", name: "Alessandro Tech Solutions", icon: "💻", color: "#1a3a6e" },
];

const STORAGE_KEY = "alessandro_data";
const GOLD = "#c9a84c";
const DARK = "#0e1a2b";
const LIGHT = "#f0f4fa";
const WHITE = "#ffffff";

function getInitialData() {
  return {
    customers: [
      { id: 1, name: "James Mokoena", email: "james@email.com", phone: "+27 71 234 5678", business: "soft-loans", joined: "2024-11-01", status: "active" },
      { id: 2, name: "Thabo Nkosi", email: "thabo@email.com", phone: "+27 82 345 6789", business: "barbershop", joined: "2024-12-03", status: "active" },
      { id: 3, name: "Lerato Dlamini", email: "lerato@email.com", phone: "+27 73 456 7890", business: "fashion", joined: "2025-01-15", status: "active" },
      { id: 4, name: "Sipho Zulu", email: "sipho@email.com", phone: "+27 64 567 8901", business: "tech", joined: "2025-02-20", status: "active" },
      { id: 5, name: "Nomsa Khumalo", email: "nomsa@email.com", phone: "+27 79 678 9012", business: "mobile-money", joined: "2025-03-10", status: "active" },
    ],
    bookings: [
      { id: 1, customerId: 2, customerName: "Thabo Nkosi", business: "barbershop", service: "Classic Cut & Shave", date: "2026-06-25", time: "10:00", status: "confirmed", notes: "Fade on sides" },
      { id: 2, customerId: 3, customerName: "Lerato Dlamini", business: "fashion", service: "Style Consultation", date: "2026-06-26", time: "14:00", status: "pending", notes: "Looking for evening wear" },
      { id: 3, customerId: 4, customerName: "Sipho Zulu", business: "tech", service: "Website Development", date: "2026-06-27", time: "09:00", status: "confirmed", notes: "E-commerce site" },
      { id: 4, customerId: 1, customerName: "James Mokoena", business: "soft-loans", service: "Loan Consultation", date: "2026-06-28", time: "11:00", status: "pending", notes: "R50,000 personal loan" },
    ],
    messages: [
      { id: 1, from: "Thabo Nkosi", email: "thabo@email.com", business: "barbershop", subject: "Appointment Reschedule", message: "Hi, I need to reschedule my appointment to next week Friday.", date: "2026-06-22", read: false },
      { id: 2, from: "Lerato Dlamini", email: "lerato@email.com", business: "fashion", subject: "New Collection Query", message: "Do you have the winter 2026 collection available yet?", date: "2026-06-21", read: true },
      { id: 3, from: "Sipho Zulu", email: "sipho@email.com", business: "tech", subject: "Project Update", message: "Can we set up a call to discuss the project milestones?", date: "2026-06-20", read: false },
      { id: 4, from: "Nomsa Khumalo", email: "nomsa@email.com", business: "mobile-money", subject: "Transaction Issue", message: "I experienced a failed transaction yesterday, please assist.", date: "2026-06-19", read: true },
    ],
    emails: [
      { id: 1, from: "james@email.com", fromName: "James Mokoena", business: "soft-loans", subject: "Loan Application Documents", body: "Please find attached my supporting documents for the loan application. Kindly confirm receipt.", date: "2026-06-22", read: false, attachments: ["ID_Copy.pdf", "Payslip.pdf"] },
      { id: 2, from: "thabo@email.com", fromName: "Thabo Nkosi", business: "barbershop", subject: "Re: Booking Confirmation", body: "Thank you for confirming my appointment. I will be there at 10am sharp.", date: "2026-06-21", read: true, attachments: [] },
      { id: 3, from: "sipho@email.com", fromName: "Sipho Zulu", business: "tech", subject: "Project Brief", body: "Hi Team, please find the full project brief and wireframes for the new website. Let me know if you need anything else.", date: "2026-06-20", read: false, attachments: ["Brief.pdf", "Wireframes.zip"] },
    ],
    requests: [
      { id: 1, customerId: 1, customerName: "James Mokoena", email: "james@email.com", business: "soft-loans", type: "Loan Application", details: "Requesting R50,000 personal loan for home improvement. Employed, stable income.", date: "2026-06-20", status: "under-review", priority: "high" },
      { id: 2, customerId: 3, customerName: "Lerato Dlamini", email: "lerato@email.com", business: "fashion", type: "Custom Order", details: "Need a custom wedding outfit for August 2026. Budget R15,000.", date: "2026-06-21", status: "pending", priority: "medium" },
      { id: 3, customerId: 4, customerName: "Sipho Zulu", email: "sipho@email.com", business: "tech", type: "Service Quote", details: "Requesting a formal quote for full e-commerce website with payment gateway integration.", date: "2026-06-22", status: "pending", priority: "high" },
      { id: 4, customerId: 5, customerName: "Nomsa Khumalo", email: "nomsa@email.com", business: "mobile-money", type: "Account Issue", details: "Transaction of R2,500 failed but account was debited. Requesting urgent reversal.", date: "2026-06-19", status: "resolved", priority: "urgent" },
    ],
    services: [
      { id: 1, customerId: 1, customerName: "James Mokoena", business: "soft-loans", service: "Personal Loan - R30,000", amount: "R30,000", status: "approved", date: "2026-06-01" },
      { id: 2, customerId: 5, customerName: "Nomsa Khumalo", business: "mobile-money", service: "Money Transfer", amount: "R5,000", status: "completed", date: "2026-06-10" },
      { id: 3, customerId: 4, customerName: "Sipho Zulu", business: "tech", service: "App Development Package", amount: "R25,000", status: "in-progress", date: "2026-06-15" },
      { id: 4, customerId: 3, customerName: "Lerato Dlamini", business: "fashion", service: "Premium Wardrobe Package", amount: "R8,500", status: "completed", date: "2026-06-18" },
    ],
  };
}

async function loadData() {
  try {
    const result = await window.storage.get(STORAGE_KEY, true);
    return result ? JSON.parse(result.value) : getInitialData();
  } catch { return getInitialData(); }
}

async function saveData(data) {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(data), true); } catch (e) { console.error(e); }
}

const badge = (status) => {
  const map = {
    confirmed: { bg: "#d1fae5", color: "#065f46" }, pending: { bg: "#fef3c7", color: "#92400e" },
    approved: { bg: "#d1fae5", color: "#065f46" }, completed: { bg: "#e0e7ff", color: "#3730a3" },
    "in-progress": { bg: "#fef3c7", color: "#92400e" }, active: { bg: "#d1fae5", color: "#065f46" },
    cancelled: { bg: "#fee2e2", color: "#991b1b" }, "under-review": { bg: "#dbeafe", color: "#1e40af" },
    resolved: { bg: "#d1fae5", color: "#065f46" }, urgent: { bg: "#fee2e2", color: "#991b1b" },
    high: { bg: "#fef3c7", color: "#92400e" }, medium: { bg: "#e0e7ff", color: "#3730a3" },
  };
  const s = map[status] || { bg: "#e5e7eb", color: "#374151" };
  return <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{status?.replace("-", " ")}</span>;
};

// CSV Export
function exportCSV(rows, headers, filename) {
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${(r[h] || "")}"`.replace(/\n/g, " ")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// Print-friendly report
function printReport(data, dateFrom, dateTo, reportType) {
  const filter = (arr) => arr.filter(item => {
    if (!item.date) return true;
    const d = item.date;
    return (!dateFrom || d >= dateFrom) && (!dateTo || d <= dateTo);
  });

  const title = `Alessandro Enterprises — ${reportType} Report`;
  const range = dateFrom || dateTo ? `Period: ${dateFrom || "All"} to ${dateTo || "All"}` : "Period: All Time";

  const sections = {
    "All": [
      { heading: "Customers", cols: ["Name","Email","Phone","Business","Joined","Status"], rows: data.customers.map(c => ({ Name: c.name, Email: c.email, Phone: c.phone, Business: BUSINESSES.find(b=>b.id===c.business)?.name||"", Joined: c.joined, Status: c.status })) },
      { heading: "Bookings", cols: ["Customer","Business","Service","Date","Time","Status"], rows: filter(data.bookings).map(b => ({ Customer: b.customerName, Business: BUSINESSES.find(bz=>bz.id===b.business)?.name||"", Service: b.service, Date: b.date, Time: b.time, Status: b.status })) },
      { heading: "Requests", cols: ["Customer","Business","Type","Date","Status","Priority"], rows: filter(data.requests||[]).map(r => ({ Customer: r.customerName, Business: BUSINESSES.find(bz=>bz.id===r.business)?.name||"", Type: r.type, Date: r.date, Status: r.status, Priority: r.priority })) },
      { heading: "Services", cols: ["Customer","Business","Service","Amount","Date","Status"], rows: filter(data.services).map(s => ({ Customer: s.customerName, Business: BUSINESSES.find(b=>b.id===s.business)?.name||"", Service: s.service, Amount: s.amount, Date: s.date, Status: s.status })) },
    ],
    "Customers": [{ heading: "Customers", cols: ["Name","Email","Phone","Business","Joined","Status"], rows: data.customers.map(c => ({ Name: c.name, Email: c.email, Phone: c.phone, Business: BUSINESSES.find(b=>b.id===c.business)?.name||"", Joined: c.joined, Status: c.status })) }],
    "Bookings": [{ heading: "Bookings", cols: ["Customer","Business","Service","Date","Time","Status"], rows: filter(data.bookings).map(b => ({ Customer: b.customerName, Business: BUSINESSES.find(bz=>bz.id===b.business)?.name||"", Service: b.service, Date: b.date, Time: b.time, Status: b.status })) }],
    "Requests": [{ heading: "Requests", cols: ["Customer","Business","Type","Details","Date","Status","Priority"], rows: filter(data.requests||[]).map(r => ({ Customer: r.customerName, Business: BUSINESSES.find(bz=>bz.id===r.business)?.name||"", Type: r.type, Details: r.details, Date: r.date, Status: r.status, Priority: r.priority })) }],
    "Services": [{ heading: "Services", cols: ["Customer","Business","Service","Amount","Date","Status"], rows: filter(data.services).map(s => ({ Customer: s.customerName, Business: BUSINESSES.find(b=>b.id===s.business)?.name||"", Service: s.service, Amount: s.amount, Date: s.date, Status: s.status })) }],
  };

  const sec = sections[reportType] || sections["All"];
  const tableHTML = sec.map(({ heading, cols, rows }) => `
    <h3 style="color:#0e1a2b;border-bottom:2px solid #c9a84c;padding-bottom:6px;margin-top:28px">${heading}</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:12px">
      <tr style="background:#0e1a2b;color:#c9a84c">${cols.map(c=>`<th>${c}</th>`).join("")}</tr>
      ${rows.map((r,i)=>`<tr style="background:${i%2?"#f8fafc":"#fff"}">${cols.map(c=>`<td>${r[c]||""}</td>`).join("")}</tr>`).join("")}
    </table>
  `).join("");

  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>${title}</title><style>body{font-family:Georgia,serif;padding:32px;color:#0e1a2b}@media print{button{display:none}}</style></head><body>
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-size:28px">🏢</div>
      <h1 style="color:#0e1a2b;margin:4px 0">Alessandro Enterprises</h1>
      <h2 style="color:#c9a84c;font-weight:400;margin:0">${reportType} Report</h2>
      <p style="color:#8a9bb5;font-size:13px">${range} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString()}</p>
    </div>
    ${tableHTML}
    <div style="margin-top:40px;text-align:center;color:#8a9bb5;font-size:11px">Alessandro Enterprises · alessandrosenterprises@gmail.com · 076 814 8043</div>
    <br><button onclick="window.print()" style="padding:10px 24px;background:#0e1a2b;color:#c9a84c;border:none;border-radius:8px;font-size:14px;cursor:pointer;display:block;margin:0 auto">🖨️ Print / Save as PDF</button>
  </body></html>`);
  win.document.close();
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [filterBiz, setFilterBiz] = useState("all");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState(null);
  const [msgSubTab, setMsgSubTab] = useState("messages");
  const [reportDateFrom, setReportDateFrom] = useState("");
  const [reportDateTo, setReportDateTo] = useState("");
  const [reportType, setReportType] = useState("All");
  const [showReport, setShowReport] = useState(false);
  const [settingsTab, setSettingsTab] = useState("general");
  const [sysSettings, setSysSettings] = useState({
    siteName: "Alessandro Enterprises",
    tagline: "Your Trusted Business Partner",
    email: "alessandrosenterprises@gmail.com",
    phone: "0768148043",
    whatsapp: "0768148043",
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: false,
    autoConfirmBookings: false,
    bookingLeadHours: "2",
    maxBookingsPerDay: "20",
    notifyNewBooking: true,
    notifyNewMessage: true,
    notifyNewRequest: true,
    notifyNewEmail: true,
    theme: "dark",
    accentColor: "#c9a84c",
    adminName: "Alessandro Admin",
    adminEmail: "admin@alessandroenterprises.com",
    sessionTimeout: "60",
  });

  useEffect(() => {
    loadData().then(setData);
    const interval = setInterval(() => loadData().then(setData), 5000);
    return () => clearInterval(interval);
  }, []);

  const notify = (msg, clr) => { setNotif({ msg, clr: clr || "#065f46" }); setTimeout(() => setNotif(null), 3000); };

  const updateBookingStatus = async (id, status) => {
    const nd = { ...data, bookings: data.bookings.map(b => b.id === id ? { ...b, status } : b) };
    setData(nd); await saveData(nd); notify("Booking updated!");
  };

  const updateRequestStatus = async (id, status) => {
    const nd = { ...data, requests: data.requests.map(r => r.id === id ? { ...r, status } : r) };
    setData(nd); await saveData(nd); notify("Request updated!");
  };

  const markRead = async (id, type) => {
    if (type === "email") {
      const nd = { ...data, emails: data.emails.map(e => e.id === id ? { ...e, read: true } : e) };
      setData(nd); await saveData(nd);
    } else {
      const nd = { ...data, messages: data.messages.map(m => m.id === id ? { ...m, read: true } : m) };
      setData(nd); await saveData(nd);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    notify(`Reply sent!`); setReplyText("");
  };

  if (!data) return (
    <div style={{ background: DARK, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontFamily: "Georgia, serif", fontSize: 22 }}>
      Loading Alessandro Enterprises...
    </div>
  );

  const unreadMsg = data.messages.filter(m => !m.read).length;
  const unreadEmail = (data.emails || []).filter(e => !e.read).length;
  const pendingReq = (data.requests || []).filter(r => r.status === "pending" || r.status === "under-review").length;
  const pendingBkg = data.bookings.filter(b => b.status === "pending").length;
  const totalUnread = unreadMsg + unreadEmail + pendingReq;
  const filtered = (arr) => filterBiz === "all" ? arr : arr.filter(i => i.business === filterBiz);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "bookings", label: "Bookings", icon: "📅", badge: pendingBkg },
    { id: "messages", label: "Messages", icon: "✉️", badge: unreadMsg },
    { id: "emails", label: "Emails", icon: "📧", badge: unreadEmail },
    { id: "requests", label: "Requests", icon: "📋", badge: pendingReq },
    { id: "services", label: "Services", icon: "⚙️" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "settings", label: "Settings", icon: "🔧" },
  ];

  const inputSt = { padding: "8px 14px", border: "1px solid #e5eaf2", borderRadius: 8, fontSize: 13, color: DARK, background: WHITE, outline: "none" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: LIGHT, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: DARK, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "26px 20px 18px", borderBottom: "1px solid #1e3050" }}>
          <div style={{ color: GOLD, fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase" }}>Alessandro</div>
          <div style={{ color: WHITE, fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700 }}>Enterprises</div>
          <div style={{ color: "#5a7fa8", fontSize: 10, letterSpacing: 2, marginTop: 2 }}>ADMIN PORTAL</div>
        </div>
        <nav style={{ flex: 1, padding: "14px 0" }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setSearch(""); }} style={{
              display: "flex", alignItems: "center", width: "100%", padding: "10px 20px", border: "none", cursor: "pointer",
              background: tab === n.id ? `linear-gradient(90deg,${GOLD}22,transparent)` : "transparent",
              borderLeft: tab === n.id ? `3px solid ${GOLD}` : "3px solid transparent",
              color: tab === n.id ? GOLD : "#7a9cc0", fontSize: 13, gap: 10, textAlign: "left",
            }}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span style={{ flex: 1, fontWeight: tab === n.id ? 600 : 400 }}>{n.label}</span>
              {n.badge > 0 && <span style={{ background: "#ef4444", color: WHITE, borderRadius: 10, fontSize: 10, padding: "1px 6px", fontWeight: 700 }}>{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 18px", borderTop: "1px solid #1e3050" }}>
          <div style={{ color: "#5a7fa8", fontSize: 9, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Filter by Business</div>
          <button onClick={() => setFilterBiz("all")} style={{ display: "block", width: "100%", padding: "5px 8px", border: "none", background: filterBiz === "all" ? "#1e3050" : "transparent", borderRadius: 6, color: filterBiz === "all" ? GOLD : "#5a7fa8", fontSize: 11, textAlign: "left", cursor: "pointer", marginBottom: 2 }}>All Businesses</button>
          {BUSINESSES.map(b => (
            <button key={b.id} onClick={() => setFilterBiz(filterBiz === b.id ? "all" : b.id)} style={{
              display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "5px 8px", border: "none",
              background: filterBiz === b.id ? "#1e3050" : "transparent", borderRadius: 6, cursor: "pointer", marginBottom: 2,
            }}>
              <span style={{ fontSize: 12 }}>{b.icon}</span>
              <span style={{ color: filterBiz === b.id ? GOLD : "#5a7fa8", fontSize: 10, textAlign: "left", lineHeight: 1.3 }}>{b.name.replace("Alessandro ", "")}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #1e3050" }}>
          <div style={{ color: "#5a7fa8", fontSize: 9, letterSpacing: 1 }}>📧 alessandrosenterprises@gmail.com</div>
          <div style={{ color: "#5a7fa8", fontSize: 9, marginTop: 3 }}>📞 076 814 8043</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: WHITE, borderBottom: "1px solid #e5eaf2", padding: "12px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17, color: DARK, fontWeight: 700 }}>{navItems.find(n => n.id === tab)?.label}</div>
            <div style={{ color: "#8a9bb5", fontSize: 11, marginTop: 1 }}>
              {filterBiz !== "all" ? BUSINESSES.find(b => b.id === filterBiz)?.name : "All Businesses"} · {new Date().toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ background: DARK, color: GOLD, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>ADMIN</div>
        </div>

        {notif && <div style={{ position: "fixed", top: 18, right: 18, background: notif.clr, color: WHITE, padding: "12px 20px", borderRadius: 10, zIndex: 999, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px #0003" }}>✓ {notif.msg}</div>}

        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 24 }}>
                {[
                  { label: "Total Customers", value: data.customers.length, icon: "👥", color: "#3b82f6" },
                  { label: "Active Bookings", value: data.bookings.filter(b => b.status !== "cancelled").length, icon: "📅", color: GOLD },
                  { label: "Unread Inbox", value: totalUnread, icon: "✉️", color: "#ef4444" },
                  { label: "Pending Requests", value: pendingReq, icon: "📋", color: "#10b981" },
                ].map(s => (
                  <div key={s.label} style={{ background: WHITE, borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 12px #0001", borderTop: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: DARK, fontFamily: "Georgia, serif" }}>{s.value}</div>
                    <div style={{ color: "#8a9bb5", fontSize: 11, marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                <div style={{ background: WHITE, borderRadius: 14, padding: 20, boxShadow: "0 2px 12px #0001" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: DARK, fontWeight: 700, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                    Recent Bookings <button onClick={() => setTab("bookings")} style={{ fontSize: 11, color: GOLD, border: "none", background: "none", cursor: "pointer", fontWeight: 600 }}>View All →</button>
                  </div>
                  {data.bookings.slice(0, 4).map(b => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #f0f4fa" }}>
                      <div style={{ width: 32, height: 32, background: DARK, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{BUSINESSES.find(bz => bz.id === b.business)?.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{b.customerName}</div>
                        <div style={{ fontSize: 10, color: "#8a9bb5" }}>{b.service} · {b.date}</div>
                      </div>
                      {badge(b.status)}
                    </div>
                  ))}
                </div>
                <div style={{ background: WHITE, borderRadius: 14, padding: 20, boxShadow: "0 2px 12px #0001" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: DARK, fontWeight: 700, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                    Recent Requests <button onClick={() => { setTab("messages"); setMsgSubTab("requests"); }} style={{ fontSize: 11, color: GOLD, border: "none", background: "none", cursor: "pointer", fontWeight: 600 }}>View All →</button>
                  </div>
                  {(data.requests || []).slice(0, 4).map(r => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #f0f4fa" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{r.customerName}</div>
                        <div style={{ fontSize: 10, color: "#8a9bb5" }}>{r.type} · {r.date}</div>
                      </div>
                      {badge(r.status)}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: WHITE, borderRadius: 14, padding: 20, boxShadow: "0 2px 12px #0001" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: DARK, fontWeight: 700, marginBottom: 14 }}>Business Overview</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                  {BUSINESSES.map(b => (
                    <div key={b.id} style={{ background: LIGHT, borderRadius: 12, padding: "14px 12px", borderLeft: `4px solid ${b.color}` }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{b.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: DARK, marginBottom: 3, lineHeight: 1.3 }}>{b.name.replace("Alessandro ", "")}</div>
                      <div style={{ fontSize: 10, color: "#8a9bb5" }}>{data.customers.filter(c => c.business === b.id).length} customers</div>
                      <div style={{ fontSize: 10, color: "#8a9bb5" }}>{data.bookings.filter(bk => bk.business === b.id).length} bookings</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {tab === "bookings" && (
            <div style={{ background: WHITE, borderRadius: 14, padding: 22, boxShadow: "0 2px 12px #0001" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputSt, flex: 1, minWidth: 180 }} />
                <select onChange={e => setFilterBiz(e.target.value)} value={filterBiz} style={inputSt}>
                  <option value="all">All Businesses</option>
                  {BUSINESSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: LIGHT }}>
                  {["Customer","Business","Service","Date & Time","Notes","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered(data.bookings).filter(b => !search || b.customerName.toLowerCase().includes(search.toLowerCase()) || b.service.toLowerCase().includes(search.toLowerCase())).map(b => (
                    <tr key={b.id} style={{ borderBottom: "1px solid #f0f4fa" }}>
                      <td style={{ padding: "11px 12px", fontSize: 13, fontWeight: 600, color: DARK }}>{b.customerName}</td>
                      <td style={{ padding: "11px 12px", fontSize: 11 }}>{BUSINESSES.find(bz => bz.id === b.business)?.icon} {BUSINESSES.find(bz => bz.id === b.business)?.name.replace("Alessandro ", "")}</td>
                      <td style={{ padding: "11px 12px", fontSize: 12, color: "#5a7fa8" }}>{b.service}</td>
                      <td style={{ padding: "11px 12px", fontSize: 11, color: "#5a7fa8" }}>{b.date} {b.time}</td>
                      <td style={{ padding: "11px 12px", fontSize: 11, color: "#9ca3af", fontStyle: "italic", maxWidth: 140 }}>{b.notes || "—"}</td>
                      <td style={{ padding: "11px 12px" }}>{badge(b.status)}</td>
                      <td style={{ padding: "11px 12px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          {b.status === "pending" && <button onClick={() => updateBookingStatus(b.id, "confirmed")} style={{ padding: "3px 9px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Confirm</button>}
                          {b.status !== "cancelled" && <button onClick={() => updateBookingStatus(b.id, "cancelled")} style={{ padding: "3px 9px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Cancel</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CUSTOMERS */}
          {tab === "customers" && (
            <div style={{ background: WHITE, borderRadius: 14, padding: 22, boxShadow: "0 2px 12px #0001" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputSt, flex: 1 }} />
                <select onChange={e => setFilterBiz(e.target.value)} value={filterBiz} style={inputSt}>
                  <option value="all">All Businesses</option>
                  {BUSINESSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: LIGHT }}>
                  {["Name","Email","Phone","Business","Joined","Status","Actions"].map(h => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered(data.customers).filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())).map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f0f4fa" }}>
                      <td style={{ padding: "11px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 32, height: 32, background: DARK, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontWeight: 700, fontSize: 12 }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 12px", fontSize: 12, color: "#5a7fa8" }}>{c.email}</td>
                      <td style={{ padding: "11px 12px", fontSize: 12, color: "#5a7fa8" }}>{c.phone}</td>
                      <td style={{ padding: "11px 12px", fontSize: 11 }}>{BUSINESSES.find(b => b.id === c.business)?.icon} {BUSINESSES.find(b => b.id === c.business)?.name.replace("Alessandro ", "")}</td>
                      <td style={{ padding: "11px 12px", fontSize: 12, color: "#8a9bb5" }}>{c.joined}</td>
                      <td style={{ padding: "11px 12px" }}>{badge(c.status)}</td>
                      <td style={{ padding: "11px 12px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {c.status !== "blocked" ? (
                            <button onClick={async () => {
                              const nd = { ...data, customers: data.customers.map(x => x.id === c.id ? { ...x, status: "blocked" } : x) };
                              setData(nd); await saveData(nd); notify("User blocked.");
                            }} style={{ padding: "4px 10px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>🚫 Block</button>
                          ) : (
                            <button onClick={async () => {
                              const nd = { ...data, customers: data.customers.map(x => x.id === c.id ? { ...x, status: "active" } : x) };
                              setData(nd); await saveData(nd); notify("User unblocked.");
                            }} style={{ padding: "4px 10px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>✓ Unblock</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {tab === "messages" && (
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, height: "calc(100vh - 160px)" }}>
              <div style={{ background: WHITE, borderRadius: 14, boxShadow: "0 2px 12px #0001", overflow: "auto" }}>
                <div style={{ padding: "16px 18px", borderBottom: "1px solid #f0f4fa", fontFamily: "Georgia, serif", fontWeight: 700, color: DARK, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>💬 Messages</span>
                  <span style={{ background: "#ef4444", color: WHITE, borderRadius: 10, fontSize: 10, padding: "1px 7px", fontWeight: 700 }}>{unreadMsg}</span>
                </div>
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #f0f4fa" }}>
                  <input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "7px 12px", border: "1px solid #e5eaf2", borderRadius: 8, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                </div>
                {filtered(data.messages).filter(m => !search || m.from.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase())).map(m => (
                  <div key={m.id} onClick={() => { setSelectedMsg(m); markRead(m.id, "message"); }} style={{
                    padding: "13px 18px", borderBottom: "1px solid #f0f4fa", cursor: "pointer",
                    background: selectedMsg?.id === m.id ? LIGHT : WHITE,
                    borderLeft: !m.read ? `3px solid ${GOLD}` : "3px solid transparent",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: m.read ? 500 : 700, color: DARK }}>{m.from}</span>
                      <span style={{ fontSize: 10, color: "#b0bec5" }}>{m.date}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: m.read ? 400 : 600, color: "#374151", marginBottom: 3 }}>{m.subject}</div>
                    <div style={{ fontSize: 10, color: "#8a9bb5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</div>
                    <span style={{ fontSize: 9, color: GOLD, background: DARK, padding: "2px 6px", borderRadius: 8, marginTop: 5, display: "inline-block" }}>{BUSINESSES.find(b => b.id === m.business)?.name.replace("Alessandro ", "")}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: WHITE, borderRadius: 14, boxShadow: "0 2px 12px #0001", display: "flex", flexDirection: "column" }}>
                {selectedMsg ? (
                  <>
                    <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0f4fa" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 5 }}>{selectedMsg.subject}</div>
                      <div style={{ fontSize: 11, color: "#8a9bb5" }}>From: <strong style={{ color: DARK }}>{selectedMsg.from}</strong> &lt;{selectedMsg.email}&gt; · {selectedMsg.date}</div>
                    </div>
                    <div style={{ flex: 1, padding: "20px 22px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{selectedMsg.message}</div>
                    <div style={{ padding: 18, borderTop: "1px solid #f0f4fa" }}>
                      <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..."
                        style={{ width: "100%", padding: 12, border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, resize: "none", height: 80, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      <button onClick={sendReply} style={{ marginTop: 8, padding: "9px 22px", background: DARK, color: GOLD, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Send Reply</button>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#8a9bb5", gap: 8 }}>
                    <span style={{ fontSize: 36 }}>💬</span>
                    <span style={{ fontSize: 13 }}>Select a message to read</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── EMAILS TAB ── */}
          {tab === "emails" && (
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, height: "calc(100vh - 160px)" }}>
              <div style={{ background: WHITE, borderRadius: 14, boxShadow: "0 2px 12px #0001", overflow: "auto" }}>
                <div style={{ padding: "16px 18px", borderBottom: "1px solid #f0f4fa", fontFamily: "Georgia, serif", fontWeight: 700, color: DARK, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>📧 Email Inbox</span>
                  <span style={{ background: "#ef4444", color: WHITE, borderRadius: 10, fontSize: 10, padding: "1px 7px", fontWeight: 700 }}>{unreadEmail}</span>
                </div>
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #f0f4fa" }}>
                  <input placeholder="Search emails..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "7px 12px", border: "1px solid #e5eaf2", borderRadius: 8, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                </div>
                {filtered(data.emails || []).filter(e => !search || e.fromName.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase())).map(e => (
                  <div key={e.id} onClick={() => { setSelectedEmail(e); markRead(e.id, "email"); }} style={{
                    padding: "13px 18px", borderBottom: "1px solid #f0f4fa", cursor: "pointer",
                    background: selectedEmail?.id === e.id ? LIGHT : WHITE,
                    borderLeft: !e.read ? `3px solid ${GOLD}` : "3px solid transparent",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: e.read ? 500 : 700, color: DARK }}>{e.fromName}</span>
                      <span style={{ fontSize: 10, color: "#b0bec5" }}>{e.date}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: e.read ? 400 : 600, color: "#374151", marginBottom: 3 }}>{e.subject}</div>
                    <div style={{ fontSize: 10, color: "#8a9bb5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.body}</div>
                    {e.attachments?.length > 0 && <div style={{ fontSize: 10, color: "#3b82f6", marginTop: 4 }}>📎 {e.attachments.length} attachment(s)</div>}
                    <span style={{ fontSize: 9, color: GOLD, background: DARK, padding: "2px 6px", borderRadius: 8, marginTop: 5, display: "inline-block" }}>{BUSINESSES.find(b => b.id === e.business)?.name.replace("Alessandro ", "")}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: WHITE, borderRadius: 14, boxShadow: "0 2px 12px #0001", display: "flex", flexDirection: "column" }}>
                {selectedEmail ? (
                  <>
                    <div style={{ padding: "18px 22px", borderBottom: "1px solid #f0f4fa" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 5 }}>{selectedEmail.subject}</div>
                      <div style={{ fontSize: 11, color: "#8a9bb5" }}>From: <strong style={{ color: DARK }}>{selectedEmail.fromName}</strong> &lt;{selectedEmail.from}&gt; · {selectedEmail.date}</div>
                      {selectedEmail.attachments?.length > 0 && (
                        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {selectedEmail.attachments.map(a => (
                            <span key={a} style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 6, padding: "3px 10px", fontSize: 11 }}>📎 {a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, padding: "20px 22px", fontSize: 14, color: "#374151", lineHeight: 1.8 }}>{selectedEmail.body}</div>
                    <div style={{ padding: 18, borderTop: "1px solid #f0f4fa" }}>
                      <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={`Reply to ${selectedEmail.from}...`}
                        style={{ width: "100%", padding: 12, border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, resize: "none", height: 80, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      <button onClick={sendReply} style={{ marginTop: 8, padding: "9px 22px", background: DARK, color: GOLD, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Send Reply</button>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#8a9bb5", gap: 8 }}>
                    <span style={{ fontSize: 36 }}>📧</span>
                    <span style={{ fontSize: 13 }}>Select an email to read</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── REQUESTS TAB ── */}
          {tab === "requests" && (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <input placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputSt, flex: 1, minWidth: 200 }} />
                <select onChange={e => setFilterBiz(e.target.value)} value={filterBiz} style={inputSt}>
                  <option value="all">All Businesses</option>
                  {BUSINESSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select style={inputSt} onChange={e => setSearch(e.target.value === "all" ? "" : e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {/* Summary bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
                {[
                  { label: "Total", value: (data.requests||[]).length, color: "#3b82f6" },
                  { label: "Pending", value: (data.requests||[]).filter(r=>r.status==="pending").length, color: "#f59e0b" },
                  { label: "Under Review", value: (data.requests||[]).filter(r=>r.status==="under-review").length, color: "#6366f1" },
                  { label: "Resolved", value: (data.requests||[]).filter(r=>r.status==="resolved").length, color: "#10b981" },
                ].map(s => (
                  <div key={s.label} style={{ background: WHITE, borderRadius: 12, padding: "14px 16px", boxShadow: "0 2px 8px #0001", borderTop: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: DARK }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#8a9bb5", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {filtered(data.requests || []).filter(r => !search || r.customerName.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()) || r.status.includes(search.toLowerCase())).map(r => (
                <div key={r.id} style={{ background: WHITE, borderRadius: 14, padding: 20, marginBottom: 12, boxShadow: "0 2px 10px #0001", borderLeft: `4px solid ${BUSINESSES.find(b => b.id === r.business)?.color || GOLD}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{r.customerName} — {r.type}</div>
                      <div style={{ fontSize: 11, color: "#8a9bb5", marginTop: 3 }}>
                        {BUSINESSES.find(b => b.id === r.business)?.icon} {BUSINESSES.find(b => b.id === r.business)?.name} &nbsp;·&nbsp; 📅 {r.date} &nbsp;·&nbsp; ✉️ {r.email}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 7, alignItems: "center", flexShrink: 0 }}>
                      {badge(r.priority)} {badge(r.status)}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 14, background: LIGHT, borderRadius: 8, padding: "10px 14px" }}>{r.details}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.status === "pending" && <button onClick={() => updateRequestStatus(r.id, "under-review")} style={{ padding: "6px 14px", background: "#dbeafe", color: "#1e40af", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>🔍 Under Review</button>}
                    {r.status !== "resolved" && <button onClick={() => updateRequestStatus(r.id, "resolved")} style={{ padding: "6px 14px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>✓ Resolve</button>}
                    {r.status !== "cancelled" && <button onClick={() => updateRequestStatus(r.id, "cancelled")} style={{ padding: "6px 14px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>✕ Cancel</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SERVICES */}
          {tab === "services" && (
            <div style={{ background: WHITE, borderRadius: 14, padding: 22, boxShadow: "0 2px 12px #0001" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                <input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputSt, flex: 1 }} />
                <select onChange={e => setFilterBiz(e.target.value)} value={filterBiz} style={inputSt}>
                  <option value="all">All Businesses</option>
                  {BUSINESSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: LIGHT }}>
                  {["Customer","Business","Service","Amount","Date","Status"].map(h => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered(data.services).filter(s => !search || s.customerName.toLowerCase().includes(search.toLowerCase()) || s.service.toLowerCase().includes(search.toLowerCase())).map(s => (
                    <tr key={s.id} style={{ borderBottom: "1px solid #f0f4fa" }}>
                      <td style={{ padding: "11px 12px", fontSize: 13, fontWeight: 600, color: DARK }}>{s.customerName}</td>
                      <td style={{ padding: "11px 12px", fontSize: 11 }}>{BUSINESSES.find(b => b.id === s.business)?.icon} {BUSINESSES.find(b => b.id === s.business)?.name.replace("Alessandro ", "")}</td>
                      <td style={{ padding: "11px 12px", fontSize: 12, color: "#5a7fa8" }}>{s.service}</td>
                      <td style={{ padding: "11px 12px", fontSize: 13, fontWeight: 700, color: DARK }}>{s.amount}</td>
                      <td style={{ padding: "11px 12px", fontSize: 12, color: "#8a9bb5" }}>{s.date}</td>
                      <td style={{ padding: "11px 12px" }}>{badge(s.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORTS */}
          {tab === "reports" && (
            <div>
              <div style={{ background: WHITE, borderRadius: 14, padding: 28, boxShadow: "0 2px 12px #0001", marginBottom: 20 }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 6 }}>Generate Report</div>
                <div style={{ color: "#8a9bb5", fontSize: 12, marginBottom: 22 }}>Filter by date range and report type, then export as PDF or CSV.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Date From</label>
                    <input type="date" value={reportDateFrom} onChange={e => setReportDateFrom(e.target.value)} style={{ ...inputSt, width: "100%", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Date To</label>
                    <input type="date" value={reportDateTo} onChange={e => setReportDateTo(e.target.value)} style={{ ...inputSt, width: "100%", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Report Type</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ ...inputSt, width: "100%", boxSizing: "border-box" }}>
                      {["All","Customers","Bookings","Requests","Services"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => printReport(data, reportDateFrom, reportDateTo, reportType)}
                    style={{ padding: "11px 28px", background: DARK, color: GOLD, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                    🖨️ Export PDF Report
                  </button>
                  <button onClick={() => {
                    const rows = reportType === "Customers" ? data.customers.map(c => ({ Name: c.name, Email: c.email, Phone: c.phone, Business: BUSINESSES.find(b => b.id === c.business)?.name || "", Joined: c.joined, Status: c.status }))
                      : reportType === "Bookings" ? data.bookings.map(b => ({ Customer: b.customerName, Business: BUSINESSES.find(bz => bz.id === b.business)?.name || "", Service: b.service, Date: b.date, Time: b.time, Status: b.status }))
                      : reportType === "Requests" ? (data.requests || []).map(r => ({ Customer: r.customerName, Business: BUSINESSES.find(b => b.id === r.business)?.name || "", Type: r.type, Date: r.date, Status: r.status, Priority: r.priority }))
                      : data.services.map(s => ({ Customer: s.customerName, Business: BUSINESSES.find(b => b.id === s.business)?.name || "", Service: s.service, Amount: s.amount, Date: s.date, Status: s.status }));
                    const cols = Object.keys(rows[0] || { "No Data": "" });
                    exportCSV(rows, cols, `Alessandro_${reportType}_Report.csv`);
                    notify("CSV exported!");
                  }} style={{ padding: "11px 28px", background: "#16a34a", color: WHITE, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
                    📊 Export CSV (Excel)
                  </button>
                  <button onClick={() => { setReportDateFrom(""); setReportDateTo(""); setReportType("All"); }} style={{ padding: "11px 20px", background: LIGHT, color: "#374151", border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, cursor: "pointer" }}>
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div style={{ background: WHITE, borderRadius: 14, padding: 22, boxShadow: "0 2px 12px #0001" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
                  Report Preview — {reportType} {reportDateFrom || reportDateTo ? `(${reportDateFrom || "Start"} → ${reportDateTo || "End"})` : "(All Time)"}
                </div>
                {["Customers","All"].includes(reportType) && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#5a7fa8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Customers ({data.customers.length})</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead><tr style={{ background: LIGHT }}>{["Name","Email","Phone","Joined","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#8a9bb5", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
                      <tbody>{data.customers.map(c => <tr key={c.id} style={{ borderBottom: "1px solid #f0f4fa" }}><td style={{ padding: "8px 10px", fontWeight: 600, color: DARK }}>{c.name}</td><td style={{ padding: "8px 10px", color: "#5a7fa8" }}>{c.email}</td><td style={{ padding: "8px 10px", color: "#5a7fa8" }}>{c.phone}</td><td style={{ padding: "8px 10px", color: "#8a9bb5" }}>{c.joined}</td><td style={{ padding: "8px 10px" }}>{badge(c.status)}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
                {["Bookings","All"].includes(reportType) && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#5a7fa8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Bookings ({data.bookings.filter(b => (!reportDateFrom || b.date >= reportDateFrom) && (!reportDateTo || b.date <= reportDateTo)).length})</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead><tr style={{ background: LIGHT }}>{["Customer","Service","Date","Time","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#8a9bb5", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
                      <tbody>{data.bookings.filter(b => (!reportDateFrom || b.date >= reportDateFrom) && (!reportDateTo || b.date <= reportDateTo)).map(b => <tr key={b.id} style={{ borderBottom: "1px solid #f0f4fa" }}><td style={{ padding: "8px 10px", fontWeight: 600, color: DARK }}>{b.customerName}</td><td style={{ padding: "8px 10px", color: "#5a7fa8" }}>{b.service}</td><td style={{ padding: "8px 10px", color: "#8a9bb5" }}>{b.date}</td><td style={{ padding: "8px 10px", color: "#8a9bb5" }}>{b.time}</td><td style={{ padding: "8px 10px" }}>{badge(b.status)}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
                {["Requests","All"].includes(reportType) && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#5a7fa8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Requests ({(data.requests||[]).filter(r => (!reportDateFrom || r.date >= reportDateFrom) && (!reportDateTo || r.date <= reportDateTo)).length})</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead><tr style={{ background: LIGHT }}>{["Customer","Type","Date","Priority","Status"].map(h => <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#8a9bb5", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
                      <tbody>{(data.requests||[]).filter(r => (!reportDateFrom || r.date >= reportDateFrom) && (!reportDateTo || r.date <= reportDateTo)).map(r => <tr key={r.id} style={{ borderBottom: "1px solid #f0f4fa" }}><td style={{ padding: "8px 10px", fontWeight: 600, color: DARK }}>{r.customerName}</td><td style={{ padding: "8px 10px", color: "#5a7fa8" }}>{r.type}</td><td style={{ padding: "8px 10px", color: "#8a9bb5" }}>{r.date}</td><td style={{ padding: "8px 10px" }}>{badge(r.priority)}</td><td style={{ padding: "8px 10px" }}>{badge(r.status)}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === "settings" && (
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>
              {/* Settings sidebar */}
              <div style={{ background: WHITE, borderRadius: 14, padding: 8, boxShadow: "0 2px 12px #0001", position: "sticky", top: 0 }}>
                {[
                  { id: "general", label: "General", icon: "🏢" },
                  { id: "app", label: "Customer App", icon: "📱" },
                  { id: "users", label: "User Management", icon: "👥" },
                  { id: "bookings_cfg", label: "Bookings", icon: "📅" },
                  { id: "notifications", label: "Notifications", icon: "🔔" },
                  { id: "security", label: "Security", icon: "🔒" },
                  { id: "admin", label: "Admin Account", icon: "👤" },
                ].map(s => (
                  <button key={s.id} onClick={() => setSettingsTab(s.id)} style={{
                    display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "10px 12px",
                    border: "none", borderRadius: 9, cursor: "pointer", fontSize: 13, textAlign: "left",
                    background: settingsTab === s.id ? LIGHT : "transparent",
                    color: settingsTab === s.id ? DARK : "#8a9bb5",
                    fontWeight: settingsTab === s.id ? 700 : 400,
                    borderLeft: settingsTab === s.id ? `3px solid ${GOLD}` : "3px solid transparent",
                    marginBottom: 2,
                  }}>
                    <span>{s.icon}</span> {s.label}
                  </button>
                ))}
              </div>

              {/* Settings content */}
              <div>
                {/* GENERAL */}
                {settingsTab === "general" && (
                  <div style={{ background: WHITE, borderRadius: 14, padding: 28, boxShadow: "0 2px 12px #0001" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 4 }}>General Settings</div>
                    <div style={{ color: "#8a9bb5", fontSize: 12, marginBottom: 24 }}>Configure your business identity and contact information.</div>
                    {[
                      { label: "Business Name", key: "siteName" },
                      { label: "Tagline", key: "tagline" },
                      { label: "Contact Email", key: "email" },
                      { label: "Phone Number", key: "phone" },
                      { label: "WhatsApp Number", key: "whatsapp" },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom: 18 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>{f.label}</label>
                        <input value={sysSettings[f.key]} onChange={e => setSysSettings(s => ({ ...s, [f.key]: e.target.value }))}
                          style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: DARK }} />
                      </div>
                    ))}
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Accent Color</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input type="color" value={sysSettings.accentColor} onChange={e => setSysSettings(s => ({ ...s, accentColor: e.target.value }))}
                          style={{ width: 48, height: 40, border: "1px solid #e5eaf2", borderRadius: 8, cursor: "pointer", padding: 2 }} />
                        <span style={{ fontSize: 13, color: "#5a7fa8" }}>{sysSettings.accentColor}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid #f0f4fa" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>Maintenance Mode</div>
                        <div style={{ fontSize: 11, color: "#8a9bb5" }}>Disable customer app access during updates</div>
                      </div>
                      <button onClick={() => setSysSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                        style={{ width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: sysSettings.maintenanceMode ? "#ef4444" : "#e5e7eb", position: "relative", transition: "background 0.2s" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: WHITE, position: "absolute", top: 3, left: sysSettings.maintenanceMode ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px #0003" }} />
                      </button>
                    </div>
                    {sysSettings.maintenanceMode && (
                      <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginTop: 8, fontSize: 12, color: "#92400e" }}>
                        ⚠️ Maintenance mode is ON — customers cannot access the app.
                      </div>
                    )}
                    <button onClick={() => notify("General settings saved!")} style={{ marginTop: 24, padding: "11px 28px", background: DARK, color: GOLD, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Save Changes
                    </button>
                  </div>
                )}

                {/* CUSTOMER APP MANAGEMENT */}
                {settingsTab === "app" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ background: WHITE, borderRadius: 14, padding: 24, boxShadow: "0 2px 12px #0001" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 4 }}>Customer App Management</div>
                      <div style={{ color: "#8a9bb5", fontSize: 12, marginBottom: 20 }}>Control what customers can access and do in the app.</div>
                      {[
                        { key: "allowRegistrations", label: "Allow New Registrations", desc: "Let new customers create accounts" },
                        { key: "requireEmailVerification", label: "Require Email Verification", desc: "Customers must verify email before logging in" },
                        { key: "autoConfirmBookings", label: "Auto-Confirm Bookings", desc: "Automatically confirm all new bookings" },
                        { key: "notifyNewBooking", label: "Show Booking Feature", desc: "Allow customers to make bookings via the app" },
                      ].map(f => (
                        <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f0f4fa" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{f.label}</div>
                            <div style={{ fontSize: 11, color: "#8a9bb5" }}>{f.desc}</div>
                          </div>
                          <button onClick={() => setSysSettings(s => ({ ...s, [f.key]: !s[f.key] }))}
                            style={{ width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: sysSettings[f.key] ? GOLD : "#e5e7eb", position: "relative", flexShrink: 0 }}>
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: WHITE, position: "absolute", top: 3, left: sysSettings[f.key] ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px #0003" }} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* App stats */}
                    <div style={{ background: WHITE, borderRadius: 14, padding: 24, boxShadow: "0 2px 12px #0001" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>App Statistics</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[
                          { label: "Total Users", value: data.customers.length, icon: "👥", color: "#3b82f6" },
                          { label: "Active Users", value: data.customers.filter(c => c.status === "active").length, icon: "✅", color: "#10b981" },
                          { label: "Blocked Users", value: data.customers.filter(c => c.status === "blocked").length, icon: "🚫", color: "#ef4444" },
                          { label: "Total Bookings", value: data.bookings.length, icon: "📅", color: GOLD },
                          { label: "Total Messages", value: data.messages.length, icon: "✉️", color: "#6366f1" },
                          { label: "Total Requests", value: (data.requests || []).length, icon: "📋", color: "#f59e0b" },
                        ].map(s => (
                          <div key={s.label} style={{ background: LIGHT, borderRadius: 12, padding: "14px", borderTop: `3px solid ${s.color}` }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: DARK }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: "#8a9bb5" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Maintenance banner */}
                    <div style={{ background: sysSettings.maintenanceMode ? "#fef3c7" : "#f0fdf4", borderRadius: 14, padding: 20, border: `1px solid ${sysSettings.maintenanceMode ? "#fde68a" : "#bbf7d0"}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
                            {sysSettings.maintenanceMode ? "🔴 App Offline — Maintenance Mode" : "🟢 App Online & Running"}
                          </div>
                          <div style={{ fontSize: 12, color: "#5a7fa8", marginTop: 3 }}>
                            {sysSettings.maintenanceMode ? "Customers cannot log in or access the app." : "All systems operational. Customers have full access."}
                          </div>
                        </div>
                        <button onClick={() => setSysSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                          style={{ padding: "9px 18px", background: sysSettings.maintenanceMode ? "#10b981" : "#ef4444", color: WHITE, border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          {sysSettings.maintenanceMode ? "Bring Online" : "Take Offline"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* USER MANAGEMENT */}
                {settingsTab === "users" && (
                  <div style={{ background: WHITE, borderRadius: 14, padding: 24, boxShadow: "0 2px 12px #0001" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 4 }}>User Management</div>
                    <div style={{ color: "#8a9bb5", fontSize: 12, marginBottom: 20 }}>Manage customer accounts — block, unblock, or delete users.</div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                      <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1, padding: "9px 14px", border: "1px solid #e5eaf2", borderRadius: 9, fontSize: 13, outline: "none" }} />
                      <select style={{ padding: "9px 14px", border: "1px solid #e5eaf2", borderRadius: 9, fontSize: 13, color: DARK, background: WHITE, outline: "none" }}
                        onChange={e => setFilterBiz(e.target.value)} value={filterBiz}>
                        <option value="all">All Businesses</option>
                        {BUSINESSES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    {/* Summary */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                      {[
                        { label: "All", value: data.customers.length, color: "#3b82f6" },
                        { label: "Active", value: data.customers.filter(c => c.status === "active").length, color: "#10b981" },
                        { label: "Blocked", value: data.customers.filter(c => c.status === "blocked").length, color: "#ef4444" },
                      ].map(s => (
                        <div key={s.label} style={{ background: LIGHT, borderRadius: 10, padding: "10px 18px", borderLeft: `3px solid ${s.color}` }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: DARK }}>{s.value}</div>
                          <div style={{ fontSize: 10, color: "#8a9bb5" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    {filtered(data.customers).filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())).map(c => (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f0f4fa" }}>
                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: c.status === "blocked" ? "#fee2e2" : DARK, display: "flex", alignItems: "center", justifyContent: "center", color: c.status === "blocked" ? "#991b1b" : GOLD, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "#8a9bb5" }}>{c.email} · {c.phone}</div>
                          <div style={{ fontSize: 11, color: "#5a7fa8" }}>{BUSINESSES.find(b => b.id === c.business)?.icon} {BUSINESSES.find(b => b.id === c.business)?.name.replace("Alessandro ","")}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {c.status === "blocked" ? (
                            <span style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>🚫 Blocked</span>
                          ) : (
                            <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>✓ Active</span>
                          )}
                          {c.status !== "blocked" ? (
                            <button onClick={async () => {
                              const nd = { ...data, customers: data.customers.map(x => x.id === c.id ? { ...x, status: "blocked" } : x) };
                              setData(nd); await saveData(nd); notify(`${c.name} has been blocked.`, "#991b1b");
                            }} style={{ padding: "6px 14px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>🚫 Block</button>
                          ) : (
                            <button onClick={async () => {
                              const nd = { ...data, customers: data.customers.map(x => x.id === c.id ? { ...x, status: "active" } : x) };
                              setData(nd); await saveData(nd); notify(`${c.name} has been unblocked.`);
                            }} style={{ padding: "6px 14px", background: "#d1fae5", color: "#065f46", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>✓ Unblock</button>
                          )}
                          <button onClick={async () => {
                            if (!window.confirm(`Delete ${c.name}? This cannot be undone.`)) return;
                            const nd = { ...data, customers: data.customers.filter(x => x.id !== c.id) };
                            setData(nd); await saveData(nd); notify(`${c.name} deleted.`, "#991b1b");
                          }} style={{ padding: "6px 12px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* BOOKINGS CONFIG */}
                {settingsTab === "bookings_cfg" && (
                  <div style={{ background: WHITE, borderRadius: 14, padding: 24, boxShadow: "0 2px 12px #0001" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 4 }}>Booking Settings</div>
                    <div style={{ color: "#8a9bb5", fontSize: 12, marginBottom: 24 }}>Control how appointments and bookings work.</div>
                    {[
                      { label: "Minimum Lead Time (hours)", key: "bookingLeadHours", type: "number", desc: "How many hours in advance a booking must be made" },
                      { label: "Max Bookings Per Day", key: "maxBookingsPerDay", type: "number", desc: "Maximum total bookings allowed per day across all businesses" },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>{f.label}</label>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>{f.desc}</div>
                        <input type={f.type} value={sysSettings[f.key]} onChange={e => setSysSettings(s => ({ ...s, [f.key]: e.target.value }))}
                          style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: DARK }} />
                      </div>
                    ))}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid #f0f4fa" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>Auto-Confirm Bookings</div>
                        <div style={{ fontSize: 11, color: "#8a9bb5" }}>Automatically confirm bookings without admin review</div>
                      </div>
                      <button onClick={() => setSysSettings(s => ({ ...s, autoConfirmBookings: !s.autoConfirmBookings }))}
                        style={{ width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: sysSettings.autoConfirmBookings ? GOLD : "#e5e7eb", position: "relative" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: WHITE, position: "absolute", top: 3, left: sysSettings.autoConfirmBookings ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px #0003" }} />
                      </button>
                    </div>
                    <button onClick={() => notify("Booking settings saved!")} style={{ marginTop: 24, padding: "11px 28px", background: DARK, color: GOLD, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Save Changes
                    </button>
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {settingsTab === "notifications" && (
                  <div style={{ background: WHITE, borderRadius: 14, padding: 24, boxShadow: "0 2px 12px #0001" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 4 }}>Notification Settings</div>
                    <div style={{ color: "#8a9bb5", fontSize: 12, marginBottom: 24 }}>Choose which events trigger admin notifications.</div>
                    {[
                      { key: "notifyNewBooking", label: "New Booking Received", desc: "Notify when a customer makes a booking" },
                      { key: "notifyNewMessage", label: "New Message Received", desc: "Notify when a customer sends a message" },
                      { key: "notifyNewRequest", label: "New Request Submitted", desc: "Notify when a customer submits a request" },
                      { key: "notifyNewEmail", label: "New Email Received", desc: "Notify when a customer sends an email" },
                    ].map(f => (
                      <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f0f4fa" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{f.label}</div>
                          <div style={{ fontSize: 11, color: "#8a9bb5" }}>{f.desc}</div>
                        </div>
                        <button onClick={() => setSysSettings(s => ({ ...s, [f.key]: !s[f.key] }))}
                          style={{ width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer", background: sysSettings[f.key] ? GOLD : "#e5e7eb", position: "relative", flexShrink: 0 }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: WHITE, position: "absolute", top: 3, left: sysSettings[f.key] ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px #0003" }} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => notify("Notification settings saved!")} style={{ marginTop: 24, padding: "11px 28px", background: DARK, color: GOLD, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
                  </div>
                )}

                {/* SECURITY */}
                {settingsTab === "security" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ background: WHITE, borderRadius: 14, padding: 24, boxShadow: "0 2px 12px #0001" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 4 }}>Security Settings</div>
                      <div style={{ color: "#8a9bb5", fontSize: 12, marginBottom: 24 }}>Manage access control and session policies.</div>
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>Session Timeout (minutes)</label>
                        <input type="number" value={sysSettings.sessionTimeout} onChange={e => setSysSettings(s => ({ ...s, sessionTimeout: e.target.value }))}
                          style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: DARK }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: "1px solid #f0f4fa" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>Two-Factor Authentication</div>
                          <div style={{ fontSize: 11, color: "#8a9bb5" }}>Require 2FA for admin login</div>
                        </div>
                        <span style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>Coming soon</span>
                      </div>
                      <button onClick={() => notify("Security settings saved!")} style={{ marginTop: 24, padding: "11px 28px", background: DARK, color: GOLD, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
                    </div>
                    <div style={{ background: "#fff5f5", borderRadius: 14, padding: 22, border: "1px solid #fecaca" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#991b1b", marginBottom: 6 }}>⚠️ Danger Zone</div>
                      <div style={{ fontSize: 12, color: "#b91c1c", marginBottom: 16 }}>These actions are irreversible. Proceed with caution.</div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => { if(window.confirm("Clear ALL bookings? This cannot be undone.")) { saveData({...data, bookings:[]}); setData(d => ({...d, bookings:[]})); notify("All bookings cleared.", "#991b1b"); } }}
                          style={{ padding: "9px 18px", background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Clear All Bookings</button>
                        <button onClick={() => { if(window.confirm("Reset ALL data to defaults? This cannot be undone.")) { const d = getInitialData(); saveData(d); setData(d); notify("Data reset to defaults.", "#991b1b"); } }}
                          style={{ padding: "9px 18px", background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Reset All Data</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ADMIN ACCOUNT */}
                {settingsTab === "admin" && (
                  <div style={{ background: WHITE, borderRadius: 14, padding: 24, boxShadow: "0 2px 12px #0001" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 20 }}>Admin Account</div>
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <div style={{ width: 80, height: 80, background: `linear-gradient(135deg,${DARK},#1a3a5c)`, borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: `3px solid ${GOLD}` }}>👤</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: DARK }}>{sysSettings.adminName}</div>
                      <div style={{ fontSize: 12, color: "#8a9bb5" }}>{sysSettings.adminEmail}</div>
                      <span style={{ background: DARK, color: GOLD, borderRadius: 20, padding: "3px 14px", fontSize: 11, fontWeight: 700, display: "inline-block", marginTop: 6 }}>SUPER ADMIN</span>
                    </div>
                    {[
                      { label: "Admin Name", key: "adminName" },
                      { label: "Admin Email", key: "adminEmail" },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom: 18 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>{f.label}</label>
                        <input value={sysSettings[f.key]} onChange={e => setSysSettings(s => ({ ...s, [f.key]: e.target.value }))}
                          style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: DARK }} />
                      </div>
                    ))}
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>New Password</label>
                      <input type="password" placeholder="Leave blank to keep current" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: DARK }} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#8a9bb5", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Confirm Password</label>
                      <input type="password" placeholder="Repeat new password" style={{ width: "100%", padding: "10px 14px", border: "1px solid #e5eaf2", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", color: DARK }} />
                    </div>
                    <button onClick={() => notify("Admin account updated!")} style={{ padding: "11px 28px", background: DARK, color: GOLD, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
