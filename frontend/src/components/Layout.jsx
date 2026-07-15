import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';

export function Layout({ children, compact = false }) {
  return (
    <div className={compact ? 'app app-compact' : 'app'}>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

