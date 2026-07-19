import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Booking {
  id: string;
  date: string;
  status: string;
  customers: {
    name: string;
    business: string;
  } | null;
  services: {
    name: string;
    price: number;
  } | null;
}

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('bookings-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchBookings() {
    setLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        date,
        status,
        customers:customer_id (
          name,
          business
        ),
        services:service_id (
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

    setLoading(false);
  }

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div>
      <h2>Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>
              {booking.customers?.name ?? 'Unknown Customer'}
            </h3>

            <p>
              <strong>Business:</strong>{' '}
              {booking.customers?.business ?? 'N/A'}
            </p>

            <p>
              <strong>Service:</strong>{' '}
              {booking.services?.name ?? 'Unknown'}
            </p>

            <p>
              <strong>Price:</strong>{' '}
              ${booking.services?.price ?? 0}
            </p>

            <p>
              <strong>Date:</strong>{' '}
              {new Date(booking.date).toLocaleString()}
            </p>

            <p>
              <strong>Status:</strong> {booking.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookingsPage;
