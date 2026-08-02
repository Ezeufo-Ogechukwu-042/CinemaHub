import React from 'react';
import { FiInbox, FiShoppingCart, FiHeart, FiSearch } from 'react-icons/fi';
import styles from './EmptyState.module.css';

const icons = {
  cart: FiShoppingCart,
  wishlist: FiHeart,
  search: FiSearch,
  default: FiInbox,
};

const EmptyState = ({ 
  icon = 'default', 
  title = 'Nothing here yet', 
  description = 'Check back later for updates.',
  action = null 
}) => {
  const IconComponent = icons[icon] || icons.default;
  
  return (
    <div className={styles.empty}>
      <div className={styles.iconWrapper}>
        <IconComponent />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;

