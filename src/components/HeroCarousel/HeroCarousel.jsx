import { useEffect, useState } from "react";
import styles from "./HeroCarousel.module.scss";

const images = [
  "/hero-imgs/hero-img1.jpg",
  "/hero-imgs/hero-img2.jpg",
  "/hero-imgs/hero-img3.jpg",
  "/hero-imgs/hero-img4.jpg",
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carousel}>
      <div className={styles.slides}>
        {images.map((src, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ""
            }`}
          >
            <img
              src={src}
              alt={`SavorSwift dish ${index + 1}`}
              loading="eager"
              className={index === currentIndex ? styles.visible : styles.hidden}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
