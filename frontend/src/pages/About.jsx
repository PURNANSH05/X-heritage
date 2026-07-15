export default function About() {
  return (
    <section className="section">
      <div className="container about-grid">
        <div>
          <h1>About HeritageX</h1>
          <p>
            HeritageX is a tourism and heritage platform built for scan-first discovery, multilingual
            access, and clear visitor guidance.
          </p>
          <p>
            The current build is a polished starter foundation: it includes the full page structure,
            data model, routing, search, scanner workflow, and backend API surface.
          </p>
          <div className="team-panel">
            <h2>Mission</h2>
            <p>Make heritage sites easier to find, easier to understand, and easier to visit.</p>
          </div>
          <div className="team-panel">
            <h2>Partners</h2>
            <p>UNESCO, museum data teams, travel operators, and future content contributors.</p>
          </div>
        </div>
        <div className="team-panel">
          <h2>Contact</h2>
          <form className="contact-form">
            <input placeholder="Name" />
            <input placeholder="Email" />
            <textarea rows="5" placeholder="Message" />
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
}
