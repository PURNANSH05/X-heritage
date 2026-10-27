export default function About() {
  return (
    <section className="section">
      <div className="container about-grid">
        <div>
          <h1>About HeritageX</h1>
          <p>
            HeritageX is a heritage discovery and trip-planning guide. Browse a curated catalog of
            historic sites and landmarks, search for additional places worldwide, and bring the
            information together with maps, visitor tips, and travel-planning tools.
          </p>
          <p>
            Each curated destination can include a short history, practical visit guidance, photos,
            location details, and nearby places. The camera scanner is an optional way to look up a
            landmark; if scanning is unavailable, use the destination search instead. Search results
            outside the curated catalog may come from external reference sources and should be
            checked against official local information before travel.
          </p>
          <div className="team-panel">
            <h2>Mission</h2>
            <p>Make heritage easier to discover and understand, and help travelers plan a more informed visit.</p>
          </div>
          <div className="team-panel">
            <h2>What you can do</h2>
            <p>Explore heritage destinations, save favorites, use the scanner or search, and find trip-planning options for your visit.</p>
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
