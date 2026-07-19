import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Booking {
  id: string;
  date: string;
  status: string;
  customers?: {
    name: string;
    business: string;
  };
  services?: {
    name: string;
    price: number;
  };
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
          customers (
            name,
            business
          ),
          services (
            name,
            price
          )
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings((data as Booking[]) || []);
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
        bookings.map((booking) => (
          <div key={booking.id} style={{ marginBottom: '1rem' }}>
            <strong>
              {booking.customers?.name ?? 'Unknown'} (
              {booking.customers?.business ?? 'N/A'})
            </strong>

            <br />

            <strong>Service:</strong>{' '}
            {booking.services?.name ?? 'Unknown'}{' '}
            {booking.services?.price != null
              ? `- $${booking.services.price}`
              : ''}

            <br />

            <strong>Date:</strong>{' '}
            {new Date(booking.date).toLocaleString()}

            <br />

            <strong>Status:</strong> {booking.status}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default BookingsPage;
