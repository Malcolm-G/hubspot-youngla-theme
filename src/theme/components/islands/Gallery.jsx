import { useState, useEffect } from 'react';
import styles from '../../styles/gallery.module.css';

function Gallery({
  title = 'Random Image Gallery',
  serverlessEndpoint = '/hs/serverless/gallery-fetch',
  showTitle = true,
  maxImages = 12,
  hubspotToken,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cached, setCached] = useState(false);

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
        if (data.images) {
          setImages(maxImages ? data.images.slice(0, maxImages) : data.images);
          setCached(data.cached || false);
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
          {cached && (
            <div className={styles.cacheIndicator}>
              <span>Cached</span>
            </div>
          )}
        </div>
      )}
      <div className={styles.galleryGrid}>
        {images.map((image) => (
          <div key={image.id} className={styles.imageItem}>
            <div className={styles.imageWrapper}>
              <img
                src={image.imageUrl}
                alt={image.caption || 'Random image'}
                className={styles.image}
                loading="lazy"
              />
            </div>
            {image.caption && (
              <div className={styles.caption}>
                {image.caption.length > 100 ? `${image.caption.substring(0, 100)}...` : image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
