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
    const fetchEmails = async () => {
      const { data, error } = await supabase
        .from('emails')
        .select(`
          id,
          subject,
          body,
          sent_at,
          status,
          customers (name, business)
        `)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
      } else {
        setEmails(data as Email[]);
      }
    };

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
