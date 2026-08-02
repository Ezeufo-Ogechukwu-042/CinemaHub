import React, { useState } from 'react';
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';
import styles from './StaffDashboard.module.css';

const chatData = [
  { from: 'Alex Johnson', message: 'When will my order ship?', time: '10:32 AM', unread: true, avatar: 'AJ' },
  { from: 'Staff', message: 'Your order is being processed and will ship within 24 hours.', time: '10:35 AM', unread: false, avatar: 'ST' },
  { from: 'Alex Johnson', message: 'Great, thanks!', time: '10:36 AM', unread: true, avatar: 'AJ' },
];

const StaffMessages = () => {
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState(chatData);

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages([...messages, { from: 'Staff', message: reply, time: 'Just now', unread: false, avatar: 'ST' }]);
    setReply('');
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div><h1>Messages</h1><p className={styles.subtitle}>Communicate with customers in real-time.</p></div>
      </div>
      <div className={styles.mainCard} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}><h3><FiMessageSquare /> Chat with Alex Johnson</h3></div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '300px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignSelf: msg.from === 'Staff' ? 'flex-end' : 'flex-start', flexDirection: msg.from === 'Staff' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.from === 'Staff' ? 'var(--accent)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: msg.from === 'Staff' ? '#1a1a1a' : 'white', flexShrink: 0 }}>{msg.avatar}</div>
              <div style={{ maxWidth: '70%' }}>
                <div style={{ padding: '12px 16px', background: msg.from === 'Staff' ? 'var(--accent)' : 'var(--background)', borderRadius: '12px', color: msg.from === 'Staff' ? '#1a1a1a' : 'var(--text)', fontSize: '0.9375rem' }}>{msg.message}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', textAlign: msg.from === 'Staff' ? 'right' : 'left' }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.messageInput}>
          <input type="text" placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()} />
          <button onClick={sendReply}><FiSend /></button>
        </div>
      </div>
    </div>
  );
};

export default StaffMessages;