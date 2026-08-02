import React from 'react';
import { FiHeadphones, FiCheck, FiMessageSquare, FiUser } from 'react-icons/fi';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import styles from './StaffDashboard.module.css';

const tickets = [
  { id: '#TKT-452', customer: 'Alex Johnson', subject: 'Payment failed', status: 'open', priority: 'high', time: '2h ago', message: 'My card was charged but I did not receive the movie.' },
  { id: '#TKT-451', customer: 'Sarah Miller', subject: 'Download not working', status: 'open', priority: 'normal', time: '4h ago', message: 'The download link gives a 404 error.' },
  { id: '#TKT-450', customer: 'Mike Chen', subject: 'Refund request', status: 'in-progress', priority: 'high', time: '6h ago', message: 'I accidentally purchased the wrong movie.' },
  { id: '#TKT-449', customer: 'Emma Wilson', subject: 'Wrong movie received', status: 'resolved', priority: 'normal', time: '1d ago', message: 'I received a different movie than what I ordered.' },
];

const StaffSupport = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div><h1>Support Tickets</h1><p className={styles.subtitle}>Handle customer inquiries and issues.</p></div>
      </div>
      <div className={styles.mainGrid}>
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}><h3>Active Tickets</h3></div>
          <div className={styles.ticketList}>
            {tickets.map(t => (
              <div key={t.id} className={styles.ticket}>
                <div className={styles.ticketTop}>
                  <span className={styles.ticketId}>{t.id}</span>
                  <Badge variant={t.status === 'open' ? 'primary' : t.status === 'in-progress' ? 'warning' : 'success'}>{t.status}</Badge>
                </div>
                <div className={styles.ticketSubject}>{t.subject}</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '8px' }}>{t.message}</p>
                <div className={styles.ticketBottom}>
                  <span className={styles.ticketCustomer}><FiUser /> {t.customer}</span>
                  <span className={styles.ticketTime}>{t.time}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {t.status !== 'resolved' && <Button variant="primary" size="small"><FiCheck /> Resolve</Button>}
                  <Button variant="secondary" size="small"><FiMessageSquare /> Reply</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sideCard}>
          <div className={styles.cardHeader}><h3>Ticket Stats</h3></div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--background)', borderRadius: '8px' }}>
              <span>Open</span><Badge variant="primary">3</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--background)', borderRadius: '8px' }}>
              <span>In Progress</span><Badge variant="warning">1</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--background)', borderRadius: '8px' }}>
              <span>Resolved Today</span><Badge variant="success">5</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--background)', borderRadius: '8px' }}>
              <span>Avg Response</span><span style={{ fontWeight: '700' }}>12 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSupport;