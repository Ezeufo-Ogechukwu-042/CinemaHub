import { useEffect, useState } from "react";
import { FiChevronUp } from "react-icons/fi";
import styles from "./ScrollToTop.module.css";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () =>
      window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollTop}
      className={`${styles.button} ${
        visible ? styles.show : ""
      }`}
      aria-label="Scroll to top"
    >
      <FiChevronUp />
    </button>
  );
};

export default ScrollToTop;