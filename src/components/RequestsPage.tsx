import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Request {
  id: string;
  request_type: string;
  description: string;
  created_at: string;
  status: string;
  customers: { name: string; business: string };
}

function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          id,
          request_type,
          description,
          created_at,
          status,
          customers (name, business)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
      } else {
        setRequests(data as Request[]);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <h2>Requests</h2>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        requests.map(r => (
          <div key={r.id} style={{ marginBottom: '1rem' }}>
            <strong>{r.customers?.name} ({r.customers?.business})</strong><br />
            {r.request_type}: {r.description}<br />
            Status: {r.status} | Created: {new Date(r.created_at).toLocaleString()}
          </div>
        ))
      )}
    </div>
  );
}

export default RequestsPage;
