import { useState, useEffect } from 'react';
import styles from '../../styles/instagram-gallery.module.css';

function InstagramGallery({
  title = 'Follow us on Instagram @youngla',
  instagramUrl = 'https://instagram.com/youngla',
  serverlessEndpoint = '/hs/serverless/instagram-fetch',
  showTitle = true,
  maxImages = 12,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    const fetchInstagramImages = async () => {
      try {
        setLoading(true);

        // Use the HubSpot domain for the serverless function
        const hubspotDomain = '47574277.hs-sites.com';
        const fullUrl = `https://${hubspotDomain}${serverlessEndpoint}`;

        console.log('[InstagramGallery] Fetching from:', fullUrl);

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Instagram images: ${response.status}`,
          );
        }

        const data = await response.json();
        console.log('[InstagramGallery] Response:', data);

        if (data.success && data.images) {
          // Limit the number of images if maxImages is specified
          const limitedImages = maxImages
            ? data.images.slice(0, maxImages)
            : data.images;
          setImages(limitedImages);
          setCached(data.cached || false);
        } else {
          throw new Error(data.error || 'Failed to load Instagram images');
        }
      } catch (err) {
        console.error('[InstagramGallery] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramImages();
  }, [serverlessEndpoint, maxImages]);

  const handleImageClick = (image) => {
    // Open the Instagram post in a new tab
    if (image.createdTime) {
      // Construct Instagram URL - this is a basic approach
      // Real implementation would need the actual post URL
      window.open(instagramUrl, '_blank');
    }
  };

  const handleTitleClick = () => {
    window.open(instagramUrl, '_blank');
  };

  if (loading) {
    return (
      <div className={styles.instagramGallery}>
        {showTitle && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading Instagram feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.instagramGallery}>
        {showTitle && (
          <div className={styles.header}>
            <h2 className={styles.title} onClick={handleTitleClick}>
              {title}
            </h2>
          </div>
        )}
        <div className={styles.error}>
          <p>Unable to load Instagram feed</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={styles.instagramGallery}>
        {showTitle && (
          <div className={styles.header}>
            <h2 className={styles.title} onClick={handleTitleClick}>
              {title}
            </h2>
          </div>
        )}
        <div className={styles.noImages}>
          <p>No Instagram images found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.instagramGallery}>
      {showTitle && (
        <div className={styles.header}>
          <h2 className={styles.title} onClick={handleTitleClick}>
            {title}
          </h2>
          {cached && (
            <div className={styles.cacheIndicator}>
              <span>Cached</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.gallery}>
        {images.map((image) => (
          <div
            key={image.id}
            className={styles.imageItem}
            onClick={() => handleImageClick(image)}
          >
            <div className={styles.imageWrapper}>
              <img
                src={image.imageUrl}
                alt={image.caption || 'Instagram post'}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.overlay}>
                <div className={styles.overlayContent}>
                  <span className={styles.overlayText}>View on Instagram</span>
                  <div className={styles.imageInfo}>
                    {image.type && (
                      <span className={styles.mediaType}>
                        {image.type === 'video'
                          ? '🎥'
                          : image.type === 'carousel'
                          ? '📱'
                          : '📷'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {image.caption && (
              <div className={styles.caption}>
                {image.caption.length > 100
                  ? `${image.caption.substring(0, 100)}...`
                  : image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.followButton}
        >
          Follow @youngla
        </a>
      </div>
    </div>
  );
}

export default InstagramGallery;
