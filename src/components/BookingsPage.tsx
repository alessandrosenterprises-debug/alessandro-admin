import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Booking {
  id: string;
  date: string;
  status: string;
  customers: { name: string; business: string };
  services: { name: string; price: number };
}

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          date,
          status,
          customers (name, business),
          services (name, price)
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data as Booking[]);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map(b => (
          <div key={b.id}>
            <strong>{b.customers.name} ({b.customers.business})</strong><br />
            Service: {b.services.name} – ${b.services.price}<br />
            Date: {new Date(b.date).toLocaleString()}<br />
            Status: {b.status}
          </div>
        ))
      )}
    </div>
  );
}

export default BookingsPage;
import BookingsPage from './BookingsPage';

function Dashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Existing dashboard content */}
      <BookingsPage />
    </div>
  );
}

export default Dashboard;
