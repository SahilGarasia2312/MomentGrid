import '@/styles/globals.css';

export const metadata = {
  title: 'MomentGrid — Premium Photography Studio SaaS',
  description: 'Manage bookings, client galleries, albums, and teams with state-of-the-art aesthetics and workflows.',
};

const themeInitScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('momentgrid_theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-surface-1 text-textPalette-primary transition-colors duration-300">{children}</body>
    </html>
  );
}
