import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Request {
  id: string;
  type: string;
  details: string;
  created_at: string;
  status: string;
  customers: {
    name: string;
    business: string;
  } | null;
}

function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel('requests-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests',
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchRequests() {
    setLoading(true);

    const { data, error } = await supabase
      .from('requests')
      .select(`
        id,
        type,
        details,
        created_at,
        status,
        customers:customer_id (
          name,
          business
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests((data as Request[]) || []);
    }

    setLoading(false);
  }

  if (loading) {
    return <p>Loading requests...</p>;
  }

  return (
    <div>
      <h2>Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        requests.map((request) => (
          <div
            key={request.id}
            style={{
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>
              {request.customers?.name ?? 'Unknown Customer'}
            </h3>

            <p>
              <strong>Business:</strong>{' '}
              {request.customers?.business ?? 'N/A'}
            </p>

            <p>
              <strong>Type:</strong> {request.type}
            </p>

            <p>{request.details}</p>

            <p>
              <strong>Status:</strong> {request.status}
            </p>

            <p>
              <strong>Created:</strong>{' '}
              {new Date(request.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default RequestsPage;
