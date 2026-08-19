import React from 'react';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';

export default function AuthLayout({ children }) {
  return (
    <div className={styles.authLayout}>
      {/* Left Column: Interactive Form Panel */}
      <main className={styles.authForm}>
        <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoMark}>✦</div>
            <div className={styles.logoText}>MomentGrid</div>
          </Link>

          {children}
        </div>
      </main>

      {/* Right Column: Visual Brand Storytelling Panel */}
      <aside className={styles.authVisual}>
        <div className={styles.authVisualBg} />
        <div className={styles.authVisualOrb} />
        <div className={styles.authVisualOrb} />
        <div className={styles.authVisualOrb} />

        <div className={styles.authVisualContent}>
          <blockquote className={styles.authVisualQuote}>
            &ldquo;MomentGrid transformed our studio workflow. We went from chaotic spreadsheets and endless email chains to an effortless, state-of-the-art client gallery experience.&rdquo;
          </blockquote>

          <div className={styles.authVisualAuthor}>
            <div className={styles.authorAvatar}>SL</div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Sarah Jenkins &bull; Lumière Studios</span>
              <span className={styles.authorRole}>Luxury Wedding &amp; Editorial Photography</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
