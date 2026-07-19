import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Message {
  id: string;
  content: string;
  sent_at: string;
  status: string;
  customers: {
    name: string;
    business: string;
  } | null;
}

function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    setLoading(true);

    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        sent_at,
        status,
        customers:customer_id (
          name,
          business
        )
      `)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setMessages((data as Message[]) || []);
    }

    setLoading(false);
  }

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div>
      <h2>Messages</h2>

      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            style={{
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>
              {message.customers?.name ?? 'Unknown Customer'}
            </h3>

            <p>
              <strong>Business:</strong>{' '}
              {message.customers?.business ?? 'N/A'}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <p>{message.content}</p>

            <p>
              <strong>Status:</strong> {message.status}
            </p>

            <p>
              <strong>Sent:</strong>{' '}
              {new Date(message.sent_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MessagesPage;
