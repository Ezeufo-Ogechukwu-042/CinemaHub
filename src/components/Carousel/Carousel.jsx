import React, { useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Carousel.module.css';

const Carousel = ({ children, title, action = null }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {action}
        </div>
      </div>
      <div className={styles.wrapper}>
        <button 
          className={`${styles.navBtn} ${!canScrollLeft ? styles.hidden : ''}`}
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>
        
        <div 
          className={styles.track}
          ref={scrollRef}
          onScroll={checkScroll}
        >
          {children}
        </div>

        <button 
          className={`${styles.navBtn} ${styles.right} ${!canScrollRight ? styles.hidden : ''}`}
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Carousel;