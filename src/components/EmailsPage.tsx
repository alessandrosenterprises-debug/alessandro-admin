import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Email {
  id: string;
  subject: string;
  body: string;
  sent_at: string;
  customers: {
    name: string;
    business: string;
  } | null;
}

function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();

    const channel = supabase
      .channel('emails-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
        },
        () => {
          fetchEmails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchEmails() {
    setLoading(true);

    const { data, error } = await supabase
      .from('emails')
      .select(`
        id,
        subject,
        body,
        sent_at,
        customers:customer_id (
          name,
          business
        )
      `)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching emails:', error);
    } else {
      setEmails((data as Email[]) || []);
    }

    setLoading(false);
  }

  if (loading) {
    return <p>Loading emails...</p>;
  }

  return (
    <div>
      <h2>Emails</h2>

      {emails.length === 0 ? (
        <p>No emails found.</p>
      ) : (
        emails.map((email) => (
          <div
            key={email.id}
            style={{
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>
              {email.customers?.name ?? 'Unknown Customer'}
            </h3>

            <p>
              <strong>Business:</strong>{' '}
              {email.customers?.business ?? 'N/A'}
            </p>

            <p>
              <strong>Subject:</strong> {email.subject}
            </p>

            <p>{email.body}</p>

            <p>
              <strong>Sent:</strong>{' '}
              {new Date(email.sent_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default EmailsPage;
