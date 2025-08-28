import { useState } from 'react';
import styles from '../../styles/main-navigation.module.css';

/**
 * MainNavigation Island Component
 *
 * Provides interactive navigation with:
 * - Mobile hamburger menu
 * - Responsive design
 * - Dynamic menu toggling
 */
function MainNavigation({ menu = [], phoneNumber = '', questionsText = '' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Filter menu items for main nav (only FOR HIM and FOR HER)
  const mainNavItems = menu.filter(
    (item) => item.label === 'FOR HIM' || item.label === 'FOR HER',
  );

  return (
    <nav className={styles.navigation}>
      <div className={styles.topRow}>
        {/* Hamburger Menu Button - Mobile Only */}
        <button
          className={styles.hamburgerButton}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.questionsSection}>
          <a href={`tel:${phoneNumber}`}>
            {questionsText} {phoneNumber}
          </a>
        </div>

        <div className={styles.logo}>
          <a href="/">
            <h1 className={styles.younglaText}>YOUNGLA</h1>
          </a>
        </div>

        <div className={styles.rightIcons}>
          <button className={styles.iconButton} aria-label="My Account">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M20 22C20 17.5817 16.4183 14 12 14C7.58172 14 4 17.5817 4 22"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button className={styles.iconButton} aria-label="Search">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={styles.iconButton} aria-label="Cart">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6H22L19 16H6L3 6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8 21C9.10457 21 10 20.1046 10 19C10 17.8954 9.10457 17 8 17C6.89543 17 6 17.8954 6 19C6 20.1046 6.89543 21 8 21Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className={styles.navLinks}>
        <ul>
          {menu.map((item, index) => (
            <li key={index}>
              <a href={item.link}>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation Links - FOR HIM and FOR HER only */}
      <div className={styles.mobileNavLinks}>
        <ul>
          {mainNavItems.map((item, index) => (
            <li key={index}>
              <a href={item.link}>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={toggleMenu}>
          <div
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileMenuHeader}>
              <button
                className={styles.closeButton}
                onClick={toggleMenu}
                aria-label="Close Menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ul className={styles.mobileMenuItems}>
              {menu.map((item, index) => (
                <li key={index}>
                  <a href={item.link} onClick={toggleMenu}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default MainNavigation;
