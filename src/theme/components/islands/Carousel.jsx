import styles from '../../styles/carousel.module.css';
import { useState, useEffect, useCallback } from 'react';

function Carousel({
  slides = [],
  enableAutoplay = true,
  autoPlayDelay = 5000,
  showScrollArrow = true,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideCount = slides.length;

  const goToSlide = useCallback(
    (slideIndex) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentSlide(slideIndex);

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match this with CSS transition duration
    },
    [isTransitioning],
  );

  const nextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % slideCount;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide, slideCount]);

  const prevSlide = useCallback(() => {
    const newIndex = (currentSlide - 1 + slideCount) % slideCount;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide, slideCount]);

  // Set up autoplay
  useEffect(() => {
    let interval;

    if (enableAutoplay && slideCount > 1) {
      interval = setInterval(nextSlide, autoPlayDelay);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [enableAutoplay, autoPlayDelay, nextSlide, slideCount]);

  if (slideCount === 0) {
    return <div className={styles.emptyCarousel}>No slides to display</div>;
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ''
            }`}
            style={{
              backgroundImage:
                slide.image && slide.image.src
                  ? `url(${slide.image.src})`
                  : 'none',
              transform: `translateX(${100 * (index - currentSlide)}%)`,
            }}
          >
            {slide.overlayText && (
              <div
                className={styles.overlayText}
                style={{
                  color: slide.textColor || '#FFFFFF',
                  textAlign: slide.textAlignment || 'center',
                }}
              >
                {slide.overlayText}
              </div>
            )}

            <div className={styles.buttonContainer}>
              {slide.primaryButtonText && (
                <a
                  href={slide.primaryButtonLink || '#'}
                  className={styles.button}
                  style={{
                    backgroundColor: slide.primaryButtonColor || '#000000',
                    color: slide.primaryButtonTextColor || '#FFFFFF',
                  }}
                >
                  {slide.primaryButtonText}
                </a>
              )}

              {slide.secondaryButtonText && (
                <a
                  href={slide.secondaryButtonLink || '#'}
                  className={`${styles.button} ${styles.secondaryButton}`}
                  style={{
                    backgroundColor:
                      slide.secondaryButtonColor || 'transparent',
                    color: slide.secondaryButtonTextColor || '#FFFFFF',
                    border: `1px solid ${
                      slide.secondaryButtonTextColor || '#FFFFFF'
                    }`,
                  }}
                >
                  {slide.secondaryButtonText}
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Previous/Next Buttons */}
        {slideCount > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              &#10094;
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextSlide}
              aria-label="Next slide"
            >
              &#10095;
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {slideCount > 1 && (
          <div className={styles.dotsContainer}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.dot} ${
                  index === currentSlide ? styles.activeDot : ''
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Scroll Down Arrow */}
        {showScrollArrow && (
          <button
            className={styles.scrollDownArrow}
            onClick={() => {
              const nextSection = document.querySelector('.content-wrapper');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Scroll to next section"
          >
            <span className={styles.arrowIcon}>&#8595;</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Carousel;
