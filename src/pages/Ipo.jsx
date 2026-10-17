
import { useEffect, useState } from "react";
import { getIPOListings } from "../services/ipoService";
import "./IPO.css";

function Ipo() {
  const [openIPOs, setOpenIPOs] = useState([]);
  const [upcomingIPOs, setUpcomingIPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIPOs() {
      try {
        const data = await getIPOListings();

        setOpenIPOs(data.open || []);
        setUpcomingIPOs(data.upcoming || []);
      } catch (err) {
        setError(err.message || "Failed to load IPOs");
      } finally {
        setLoading(false);
      }
    }

    loadIPOs();
  }, []);

  if (loading) {
    return <div className="ipo-page">Loading IPOs...</div>;
  }

  if (error) {
    return <div className="ipo-page ipo-error">{error}</div>;
  }

  return (
    <main className="ipo-page">
      <header className="ipo-header">
        <div>
          <h1>IPO Listings</h1>
          <p>Explore open and upcoming IPOs</p>
        </div>
      </header>

      <section className="ipo-section">
        <div className="ipo-section-heading">
          <h2>Open IPOs</h2>
          <span>{openIPOs.length} IPOs</span>
        </div>

        {openIPOs.length === 0 ? (
          <p className="ipo-empty">No IPOs are currently open.</p>
        ) : (
          <div className="ipo-grid">
            {openIPOs.map((ipo) => (
              <IPCard key={ipo.slug} ipo={ipo} status="Open" />
            ))}
          </div>
        )}
      </section>

      <section className="ipo-section">
        <div className="ipo-section-heading">
          <h2>Upcoming IPOs</h2>
          <span>{upcomingIPOs.length} IPOs</span>
        </div>

        {upcomingIPOs.length === 0 ? (
          <p className="ipo-empty">No upcoming IPOs available.</p>
        ) : (
          <div className="ipo-grid">
            {upcomingIPOs.map((ipo) => (
              <IPCard key={ipo.slug} ipo={ipo} status="Upcoming" />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function IPCard({ ipo, status }) {
  return (
    <article className="ipo-card">
      <div className="ipo-card-top">
        <span className="ipo-board">
          {ipo.board === "sme" ? "SME" : "Mainboard"}
        </span>

        <span
          className={`ipo-status ${
            status === "Open" ? "status-open" : "status-upcoming"
          }`}
        >
          {status}
        </span>
      </div>

      <h3>{ipo.name}</h3>

      <div className="ipo-details">
        <div>
          <span>Open date</span>
          <strong>{ipo.open || "—"}</strong>
        </div>

        <div>
          <span>Close date</span>
          <strong>{ipo.close || "—"}</strong>
        </div>

        <div>
          <span>Price band</span>
          <strong>{ipo.band || "Not announced"}</strong>
        </div>

        <div>
          <span>Issue size</span>
          <strong>
            {ipo.size != null ? `₹${ipo.size} Cr` : "—"}
          </strong>
        </div>
      </div>
    </article>
  );
}

export default Ipo;
