import React from 'react';
import { FiThumbsUp } from 'react-icons/fi';
import Avatar from '../Avatar/Avatar';
import Rating from '../Rating/Rating';
import styles from './ReviewCard.module.css';

const ReviewCard = ({ review }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Avatar fallback={review.avatar} size="medium" />
        <div className={styles.meta}>
          <h4>{review.user}</h4>
          <div className={styles.row}>
            <Rating value={review.rating} size="small" showValue={false} />
            {review.verified && <span className={styles.verified}>Verified Purchase</span>}
          </div>
        </div>
      </div>
      <p className={styles.text}>{review.text}</p>
      <div className={styles.footer}>
        <button className={styles.helpful}>
          <FiThumbsUp /> Helpful
        </button>
        <span className={styles.date}>{review.date}</span>
      </div>
    </div>
  );
};

export default ReviewCard;