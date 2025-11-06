import { useState, useEffect } from 'react';
import styles from '../../styles/gallery.module.css';

function Gallery({
  title = 'YoungLA Gallery (Serverless function that pulls in random images)',
  serverlessEndpoint = '/hs/serverless/instagram-fetch',
  showTitle = true,
  maxImages = 12,
  hubspotToken,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        console.log('[Gallery] Fetching from:', serverlessEndpoint);
        const response = await fetch(serverlessEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.status}`);
        }
        const data = await response.json();
        console.log('[Gallery] Fetched data:', data);
        if (data.images) {
          setImages(maxImages ? data.images.slice(0, maxImages) : data.images);
        } else {
          throw new Error(data.error || 'Failed to load images');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [serverlessEndpoint, maxImages]);

  if (loading) {
    return (
      <div className={styles.gallery}>
        {showTitle && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.gallery}>
        {showTitle && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        <div className={styles.error}>
          <p>Unable to load gallery</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={styles.gallery}>
        {showTitle && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        <div className={styles.noImages}>
          <p>No images found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {showTitle && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.galleryGrid}>
        {images.map((imageUrl) => (
          <div key={imageUrl} className={styles.imageItem}>
            <div className={styles.imageWrapper}>
              <img
                src={imageUrl}
                alt="Random image"
                className={styles.image}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
