import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Email {
  id: string;
  subject: string;
  body: string;
  sent_at: string;
  status: string;
  customers?: {
    name: string;
    business: string;
  };
}

function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          subject,
          body,
          sent_at,
          status,
          customers (
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
    };

    fetchEmails();
  }, []);

  return (
    <div>
      <h2>Emails</h2>

      {emails.length === 0 ? (
        <p>No emails yet.</p>
      ) : (
        emails.map((email) => (
          <div key={email.id} style={{ marginBottom: '1rem' }}>
            <strong>
              {email.customers?.name ?? 'Unknown'} ({email.customers?.business ?? 'N/A'})
            </strong>

            <br />

            <strong>Subject:</strong> {email.subject}

            <br />

            {email.body}

            <br />

            <small>
              Status: {email.status} | Sent:{' '}
              {new Date(email.sent_at).toLocaleString()}
            </small>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default EmailsPage;
