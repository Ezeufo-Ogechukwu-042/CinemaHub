import React, { useEffect, useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiSend, FiMessageSquare } from 'react-icons/fi';
import Button from '../../components/Button/Button';
import { contentService } from '../../services/contentService';
import { staffService } from '../../services/staffService';
import { checkRateLimit, clearRateLimit, recordRateLimitAttempt } from '../../utils/rateLimit';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [contactInfo, setContactInfo] = useState({
    address: '12B Allen Avenue, Ikeja, Lagos, Nigeria',
    phone: '+234 810 000 0000',
    email: 'support@cinemahub.ng',
    supportHours: 'Mon–Sat, 8:00 AM – 10:00 PM WAT',
  });
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      const page = await contentService.getContactPage();
      setContactInfo(page.contact || contactInfo);
      setFaqs(page.faqs || []);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const emailKey = formData.email.trim().toLowerCase();
    const rateLimitCheck = checkRateLimit('contact', emailKey || 'anonymous');

    if (!rateLimitCheck.allowed) {
      setSubmitError(rateLimitCheck.message);
      setIsSubmitting(false);
      return;
    }

    try {
      await staffService.createContactTicket({
        customerName: formData.name,
        customerEmail: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      clearRateLimit('contact', emailKey || 'anonymous');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error(error);
      const nextAttempt = recordRateLimitAttempt('contact', emailKey || 'anonymous');
      setSubmitError(nextAttempt.allowed ? (error?.message || 'Your message could not be sent right now. Please try again.') : nextAttempt.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Contact Us</h1>

        <div className={styles.layout}>
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <FiMapPin />
              <div>
                <h4>Address</h4>
                <p>{contactInfo.address}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <FiPhone />
              <div>
                <h4>Phone</h4>
                <p>{contactInfo.phone}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <FiMail />
              <div>
                <h4>Email</h4>
                <p>{contactInfo.email}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <FiMessageSquare />
              <div>
                <h4>Support Hours</h4>
                <p>{contactInfo.supportHours}</p>
              </div>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <h3>Send us a message</h3>
            <div className={styles.grid2}>
              <input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <Button variant="primary" size="large" type="submit" loading={isSubmitting} disabled={isSubmitting}>
              <FiSend /> Send Message
            </Button>
            {submitted && <p className={styles.success}>Your message has been sent to our staff team.</p>}
            {submitError && <p className={styles.error}>{submitError}</p>}
          </form>
        </div>

        <div className={styles.faq}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <details key={i} className={styles.faqItem}>
                <summary>
                  <FiMessageSquare />
                  {faq.question}
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;