---
applyTo: '**'
---

When writing CSS or JSX for React with CSS Modules:

- Never generate descendant selectors like `.container img { ... }`.
- Always create a dedicated class for each element you want to style, even for <img>, <button>, <p>, etc.
- Apply the class directly in JSX using `className={styles.className}`.
- Example (bad):
  CSS: .card img { border-radius: 8px; }
  JSX: <div className={styles.card}><img src="..." /></div>
- Example (good):
  CSS:
  .card { padding: 16px; }
  .cardImage { border-radius: 8px; }
  JSX:
    <div className={styles.card}>
      <img className={styles.cardImage} src="..." />
    </div>
- Always keep styles flat and modular: one class per element, no chaining with tags.
