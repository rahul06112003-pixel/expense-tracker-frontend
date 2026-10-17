
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <header className="home-header">
        <Link to="/" className="home-brand">
          Expense Tracker
        </Link>

        <nav className="home-nav">
          <Link to="/login">Login</Link>

          <Link
            to="/register"
            className="home-button home-button-primary"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <section className="home-hero">
        <h1>Take control of your money.</h1>

        <p>
          Track expenses, manage income, and understand your
          spending in one place. Make smarter financial
          decisions with Expense Tracker.
        </p>

        <div className="home-hero-actions">
          <Link
            to="/register"
            className="home-button home-button-primary"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="home-button home-button-secondary"
          >
            I already have an account
          </Link>
        </div>
      </section>

      
        <section className="home-features">
        <div className="home-section-heading">
            <h2>Everything you need to manage your money</h2>
            <p>
            Keep your income and expenses organized in one place.
            </p>
        </div>

        <div className="home-feature-grid">
            <article className="home-feature-card">
            <h3>Expense Management</h3>
            <p>
                Add, edit, delete, and organize your daily expenses
                with ease.
            </p>
            </article>

            <article className="home-feature-card">
            <h3>Income Tracking</h3>
            <p>
                Record your income and keep track of your finances.
            </p>
            </article>

            <article className="home-feature-card">
            <h3>Financial Reports</h3>
            <p>
                Review your spending patterns and understand where
                your money goes.
            </p>
            </article>
        </div>
        </section>

        
        <section className="home-dashboard-preview">
        <div className="home-section-heading">
            <h2>Your finances, at a glance</h2>
            <p>
            A simple overview of your income, expenses, and savings.
            </p>
        </div>

        <div className="preview-dashboard">
            <div className="preview-dashboard-header">
            <div>
                <span className="preview-eyebrow">OVERVIEW</span>
                <h3>Financial Dashboard</h3>
            </div>

            <span className="preview-period">This month</span>
            </div>

            <div className="preview-stats">
            <article className="preview-stat-card">
                <span>Total Income</span>
                <strong>₹45,000</strong>
                <small>Money received</small>
            </article>

            <article className="preview-stat-card">
                <span>Total Expenses</span>
                <strong>₹18,500</strong>
                <small>Money spent</small>
            </article>

            <article className="preview-stat-card">
                <span>Balance</span>
                <strong>₹26,500</strong>
                <small>Income minus expenses</small>
            </article>
            </div>

            <div className="preview-dashboard-bottom">
            <div className="preview-activity">
                <h4>Recent activity</h4>

                <div className="preview-transaction">
                <span className="preview-transaction-icon">F</span>
                <div>
                    <strong>Food & Dining</strong>
                    <small>Sample transaction</small>
                </div>
                <strong className="preview-expense">−₹850</strong>
                </div>

                <div className="preview-transaction">
                <span className="preview-transaction-icon">S</span>
                <div>
                    <strong>Monthly Salary</strong>
                    <small>Sample transaction</small>
                </div>
                <strong className="preview-income">+₹45,000</strong>
                </div>
            </div>

            <div className="preview-spending">
                <h4>Spending overview</h4>

                <div className="preview-spending-bar">
                <span />
                </div>

                <p>Sample visualization of monthly spending.</p>
            </div>
            </div>
        </div>

        <p className="preview-disclaimer">
            Illustrative preview — amounts and transactions are examples.
        </p>
        </section>


        <section className="home-final-cta">
        <h2>Ready to take control of your finances?</h2>

        <p>
            Start organizing your income and expenses with Expense Tracker.
        </p>

        <Link
            to="/register"
            className="home-button home-button-primary"
        >
            Create Your Free Account
        </Link>
        </section>

        <footer className="home-footer">
        <Link to="/" className="home-brand">
            Expense Tracker
        </Link>

        <p>
            Simple tools for smarter financial management.
        </p>

        <div className="home-footer-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </div>

        <small>© {new Date().getFullYear()} Expense Tracker</small>
        </footer>


    </main>
  );
}

export default Home;
