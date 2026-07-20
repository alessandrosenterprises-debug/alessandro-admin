import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import './App.css';

type Customer = { id: string; name: string; email: string; business: string | null; status: string };
type Service = { id: string; name: string; description: string | null; duration: number | null; price: number; active: boolean };
type Promotion = { id: string; title: string; description: string | null; discount: number; active: boolean };
type Booking = { id: string; date: string; notes: string | null; status: string; customers: Customer | null; services: Service | null };
type Message = { id: string; subject: string; body: string; sent_at: string; status: string; customers: Customer | null };
type Request = { id: string; request_type: string; description: string; created_at: string; status: string; customers: Customer | null };
type Email = { id: string; subject: string; body: string; sent_at: string; status: string; customers: Customer | null };

function Login({ onSession }: { onSession: (session: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !data.session) {
      setError(signInError?.message ?? 'Unable to sign in.'); setLoading(false); return;
    }
    if (data.user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('This account is not authorised to use the admin dashboard.'); setLoading(false); return;
    }
    onSession(data.session); setLoading(false);
  }

  return <main className="auth"><form onSubmit={submit} className="auth-card"><h1>Admin Dashboard</h1><p>Sign in with an administrator account.</p><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>{error && <p className="error">{error}</p>}<button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form></main>;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [promotionTitle, setPromotionTitle] = useState('');
  const [promotionDiscount, setPromotionDiscount] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const [bookingRes, messageRes, requestRes, emailRes, serviceRes, promotionRes, customerRes] = await Promise.all([
      supabase.from('bookings').select('id,date,notes,status,customers:customer_id(id,name,email,business,status),services:service_id(id,name,description,duration,price,active)').order('date', { ascending: false }),
      supabase.from('messages').select('id,subject,body,sent_at,status,customers:customer_id(id,name,email,business,status)').order('sent_at', { ascending: false }),
      supabase.from('requests').select('id,request_type,description,created_at,status,customers:customer_id(id,name,email,business,status)').order('created_at', { ascending: false }),
      supabase.from('emails').select('id,subject,body,sent_at,status,customers:customer_id(id,name,email,business,status)').order('sent_at', { ascending: false }),
      supabase.from('services').select('id,name,description,duration,price,active').order('name'),
      supabase.from('promotions').select('id,title,description,discount,active').order('title'),
      supabase.from('customers').select('id,name,email,business,status').order('created_at', { ascending: false }),
    ]);
    const results = [bookingRes, messageRes, requestRes, emailRes, serviceRes, promotionRes, customerRes];
    const firstError = results.find((result) => result.error)?.error;
    if (firstError) setError(firstError.message);
    setBookings((bookingRes.data ?? []) as unknown as Booking[]); setMessages((messageRes.data ?? []) as unknown as Message[]);
    setRequests((requestRes.data ?? []) as unknown as Request[]); setEmails((emailRes.data ?? []) as unknown as Email[]);
    setServices((serviceRes.data ?? []) as Service[]); setPromotions((promotionRes.data ?? []) as Promotion[]);
    setCustomers((customerRes.data ?? []) as Customer[]); setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.app_metadata?.role === 'admin') setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession?.user.app_metadata?.role === 'admin' ? nextSession : null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    void load();
    const channel = supabase.channel(`admin-dashboard:${session.user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emails' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, () => void load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => void load())
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [session, load]);

  async function updateStatus(table: 'bookings' | 'messages' | 'requests' | 'emails', id: string, status: string) {
    const { error: updateError } = await supabase.from(table).update({ status }).eq('id', id);
    if (updateError) setError(updateError.message); else { setNotice('Status updated.'); void load(); }
  }
  async function addService(event: FormEvent) { event.preventDefault(); const { error: insertError } = await supabase.from('services').insert({ name: serviceName.trim(), price: Number(servicePrice), active: true }); if (insertError) setError(insertError.message); else { setServiceName(''); setServicePrice(''); setNotice('Service created.'); void load(); } }
  async function addPromotion(event: FormEvent) { event.preventDefault(); const { error: insertError } = await supabase.from('promotions').insert({ title: promotionTitle.trim(), discount: Number(promotionDiscount), active: true }); if (insertError) setError(insertError.message); else { setPromotionTitle(''); setPromotionDiscount(''); setNotice('Promotion created.'); void load(); } }
  async function signOut() { await supabase.auth.signOut(); setSession(null); }

  if (!session) return <Login onSession={setSession} />;
  return (
    <div className="App">
      <header><div><h1>Alessandro Admin Dashboard</h1><p>Live customer portal data</p></div><div className="header-actions"><span>{session.user.email}</span><button onClick={() => void signOut()}>Sign out</button></div></header>
      <main>
        <div className="toolbar"><button onClick={() => void load()}>Refresh</button>{notice && <span className="notice">{notice}</span>}{error && <p className="error">{error}</p>}</div>
        {loading ? <p>Loading live data…</p> : <>
          <section className="metrics"><article><b>{customers.length}</b><span>Customers</span></article><article><b>{bookings.length}</b><span>Bookings</span></article><article><b>{messages.length}</b><span>Messages</span></article><article><b>{requests.length}</b><span>Requests</span></article></section>
          <section><h2>Bookings</h2><Table rows={bookings} empty="No bookings yet." render={(row) => <><b>{row.customers?.name ?? 'Unknown customer'}</b><span>{row.services?.name ?? 'Unknown service'} · {new Date(row.date).toLocaleString()}</span><span>{row.status}</span><StatusSelect value={row.status} onChange={(status) => void updateStatus('bookings', row.id, status)} /></>} /></section>
          <section><h2>Messages</h2><Table rows={messages} empty="No messages yet." render={(row) => <><b>{row.customers?.name ?? 'Unknown customer'} — {row.subject}</b><span>{row.body}</span><span>{new Date(row.sent_at).toLocaleString()}</span><StatusSelect value={row.status} onChange={(status) => void updateStatus('messages', row.id, status)} /></>} /></section>
          <section><h2>Requests</h2><Table rows={requests} empty="No requests yet." render={(row) => <><b>{row.customers?.name ?? 'Unknown customer'} — {row.request_type}</b><span>{row.description}</span><span>{new Date(row.created_at).toLocaleString()}</span><StatusSelect value={row.status} onChange={(status) => void updateStatus('requests', row.id, status)} /></>} /></section>
          <section><h2>Emails</h2><Table rows={emails} empty="No emails yet." render={(row) => <><b>{row.customers?.name ?? 'Unknown customer'} — {row.subject}</b><span>{row.body}</span><span>{new Date(row.sent_at).toLocaleString()}</span><StatusSelect value={row.status} onChange={(status) => void updateStatus('emails', row.id, status)} /></>} /></section>
          <section className="two-column"><div><h2>Services</h2><form onSubmit={addService} className="inline-form"><input placeholder="Service name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required /><input type="number" min="0" step="0.01" placeholder="Price" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} required /><button>Add service</button></form><Table rows={services} empty="No services." render={(row) => <><b>{row.name}</b><span>${row.price}</span><span>{row.active ? 'Active' : 'Inactive'}</span></>} /></div><div><h2>Promotions</h2><form onSubmit={addPromotion} className="inline-form"><input placeholder="Promotion title" value={promotionTitle} onChange={(e) => setPromotionTitle(e.target.value)} required /><input type="number" min="0" step="0.01" placeholder="Discount %" value={promotionDiscount} onChange={(e) => setPromotionDiscount(e.target.value)} required /><button>Add promotion</button></form><Table rows={promotions} empty="No promotions." render={(row) => <><b>{row.title}</b><span>{row.discount}% off</span><span>{row.active ? 'Active' : 'Inactive'}</span></>} /></div></section>
        </>}
      </main>
    </div>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <select value={value} onChange={(event) => onChange(event.target.value)}><option>Pending</option><option>Open</option><option>Sent</option><option>Read</option><option>Confirmed</option><option>Completed</option><option>Resolved</option><option>Closed</option><option>Cancelled</option></select>; }
function Table<T>({ rows, empty, render }: { rows: T[]; empty: string; render: (row: T) => ReactNode }) { return rows.length === 0 ? <p className="empty">{empty}</p> : <div className="records">{rows.map((row, index) => <article key={index}>{render(row)}</article>)}</div>; }

export default App;
