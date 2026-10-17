import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/expenses">Expenses</Link>
          </li>

          <li>
            <Link to="/income">Income</Link>
          </li>

          <li>
            <Link to="/Ipo">ipoPage</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;