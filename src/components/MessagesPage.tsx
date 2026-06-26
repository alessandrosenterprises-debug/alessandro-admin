import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Message {
  id: string;
  content: string;
  sent_at: string;
  status: string;
  topic: string;
  extension: string;
  event: string;
  private: boolean;
  updated_at: string;
  inserted_at: string;
  customers: { name: string; business: string };
}

function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sent_at,
          status,
          topic,
          extension,
          event,
          private,
          updated_at,
          inserted_at,
          customers (name, business)
        `)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data as Message[]);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map(m => (
          <div key={m.id} style={{ marginBottom: '1rem' }}>
            <strong>{m.customers?.name} ({m.customers?.business})</strong><br />
            {m.content}<br />
            Topic: {m.topic} | Status: {m.status}<br />
            Sent: {new Date(m.sent_at).toLocaleString()}<br />
            Event: {m.event} | Extension: {m.extension}
          </div>
        ))
      )}
    </div>
  );
}

export default MessagesPage;
