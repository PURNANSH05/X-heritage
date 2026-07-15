import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <h1>This trail leads nowhere.</h1>
        <p>Let's find your way back.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/">
            Go Home
          </Link>
          <Link className="btn btn-secondary" to="/search">
            Search a Destination
          </Link>
        </div>
      </div>
    </section>
  );
}

