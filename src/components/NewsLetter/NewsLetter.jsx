import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import styles from './NewsLetter.module.css';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await emailjs.send(
            'service_9uqzkhg',
            "template_wo0aulm",
            {
                email: email,
            },
            "-_HTfrA8Y49Os-MFy",
        );

        setSubscribed(true);
        setEmail('');
        setName('');
    } catch (error) {
        console.log(error);
        alert('Something went wrong.');
    }
};

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.box}>
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <FiMail />
            </div>
            <h3 className={styles.title}>Never Miss a Blockbuster Release</h3>
            <p className={styles.subtitle}>
              Join over 500,000+ movie lovers getting exclusive weekly discounts, early pre-orders, and curated recommendations.
            </p>
          </div>

          {subscribed ? (
            <div className={styles.successMessage}>
              <FiCheckCircle className={styles.checkIcon} />
              <span>Thank you for subscribing! Check your inbox for your welcome discount code.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Enter your email address..."
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                Subscribe Now
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;