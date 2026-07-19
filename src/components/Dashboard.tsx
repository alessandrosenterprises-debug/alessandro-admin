import React from 'react';
import BookingsPage from './BookingsPage';
import MessagesPage from './MessagesPage';
import RequestsPage from './RequestsPage';
import EmailsPage from './EmailsPage';

function Dashboard() {
  return (
    <div
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <h1>Admin Dashboard</h1>

      <BookingsPage />

      <MessagesPage />

      <RequestsPage />

      <EmailsPage />
    </div>
  );
}

export default Dashboard;
