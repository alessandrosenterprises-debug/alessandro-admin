import { supabase } from '../supabaseClient';

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Email {
  id: string;
  subject: string;
  body: string;
  sent_at: string;
  status: string;
  customers: { name: string; business: string };
}

function EmailsPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  fetchMessages();
}, []);

    fetchEmails();
  }, []);

  return (
    <div>
      <h2>Emails</h2>
      {emails.length === 0 ? (
        <p>No emails yet.</p>
      ) : (
        emails.map(e => (
          <div key={e.id} style={{ marginBottom: '1rem' }}>
            <strong>{e.customers?.name} ({e.customers?.business})</strong><br />
            Subject: {e.subject}<br />
            {e.body}<br />
            Status: {e.status} | Sent: {new Date(e.sent_at).toLocaleString()}
          </div>
        ))
      )}
    </div>
  );
}

export default EmailsPage;
