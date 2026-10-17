
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getStatistics, getMonthlyReport, getCategoryReport, getMonthlyIncomeReport } from "../services/reportService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getExpenses } from "../services/expenseService";
import { getIncome } from "../services/incomeService";


function Dashboard() {
  const { user } = useContext(AuthContext);

  const [statistics, setStatistics] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [categoryReport, setCategoryReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [incomeSummary, setIncomeSummary] = useState(0);
  const [monthlyIncomeReport, setMonthlyIncomeReport] = useState([]);
  const [recentIncome, setRecentIncome] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");

  
  
  function getDateParams(filter) {
    const now = new Date();

    if (filter === "all") {
      return {};
    }

    let start;
    let end;

    if (filter === "thisMonth") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (filter === "lastMonth") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  }

 
  const chartData = (() => {
    const monthlyTotals = new Map();

    monthlyReport.forEach((item) => {
      const key = `${item.year}-${item.month}`;

      monthlyTotals.set(key, {
        year: item.year,
        month: item.month,
        totalExpense: Number(item.totalExpense) || 0,
        totalIncome: 0,
      });
    });

    monthlyIncomeReport.forEach((item) => {
      const key = `${item.year}-${item.month}`;

      const existing = monthlyTotals.get(key) || {
        year: item.year,
        month: item.month,
        totalExpense: 0,
        totalIncome: 0,
      };

      existing.totalIncome = Number(item.totalIncome) || 0;
      monthlyTotals.set(key, existing);
    });

    return Array.from(monthlyTotals.values())
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((item) => ({
        ...item,
        monthLabel: new Date(item.year, item.month - 1)
          .toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          }),
      }));
  })();


  
  const recentTransactions = [
    ...recentExpenses.map((expense) => ({
      ...expense,
      type: "expense",
    })),
    ...recentIncome.map((income) => ({
      ...income,
      type: "income",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.transactionDate) - new Date(a.transactionDate)
    )
    .slice(0, 5);




  useEffect(() => {
    async function  fetchDashboardData() {
      const filters = getDateParams(dateFilter);
      try {
        const data = await getStatistics(filters);
        setStatistics(data.report);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

      try {
        const monthlyData = await getMonthlyReport(filters);
        setMonthlyReport(monthlyData.report);
      } catch (error) {
       console.error("Failed to load monthly report:", error);
      }

      try {
        const categoryData = await getCategoryReport(filters);
        setCategoryReport(categoryData.report);
      } catch (error) {
        console.error("Failed to load category report:", error);
      }

      try {
        const data = await getExpenses({
          ...filters,
          page: 1,
          limit: 5,
          sort: "-transactionDate",
        });

        setRecentExpenses(data.expense);
      } catch (error) {
        console.error("Failed to load recent transactions:", error);
      }

      try {
        const incomeData = await getIncome(filters);

        setIncomeSummary(
          Number(incomeData.summary?.totalIncomeAmount || 0)
        );
      } catch (error) {
        console.error("Failed to load income summary:", error);
      }

      try {
        const incomeData = await getMonthlyIncomeReport(filters);
        setMonthlyIncomeReport(incomeData.report);
      } catch (error) {
        console.error("Failed to load monthly income report:", error);
      }

      try {
        const data = await getIncome({
          ...filters,
          page: 1,
          limit: 5,
          sort: "-transactionDate",
        });

        setRecentIncome(data.income);
      } catch (error) {
        console.error("Failed to load recent income:", error);
      }
     
    }

    fetchDashboardData();
  }, [dateFilter]);

  return (
    <div>
      
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        {user && <h2>Welcome, {user.name} 👋</h2>}

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        >
          <option value="all">All Time</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
        </select>
      </div>

      {loading && <p>Loading statistics...</p>}

      {error && <p role="alert">{error}</p>}      
     

      <section className="dashboard-section">
        <h2 className="section-title">Expense Statistics</h2>

        {!loading && !error && statistics && (
          <div className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Expense</p>
              <h3 className="stat-value">
                ₹{Number(statistics.totalExpense).toLocaleString("en-IN")}
              </h3>
              <p className="stat-description">All recorded expenses</p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Total Transactions</p>
              <h3 className="stat-value">
                {statistics.totalTransaction}
              </h3>
              <p className="stat-description">Recorded transactions</p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Total Income</p>
              <h3 className="stat-value">
                ₹{incomeSummary.toLocaleString("en-IN")}
              </h3>
              <p className="stat-description">All recorded income</p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Current Balance</p>

              <h3 className="stat-value">
                ₹{(
                  incomeSummary - Number(statistics.totalExpense)
                ).toLocaleString("en-IN")}
              </h3>

              <p className="stat-description">
                Total income minus total expenses
              </p>
            </div>
          </div>
        )}
      </section>

      
      <section className="dashboard-section chart-card">
        <div className="chart-header">
          <div>
            <h2 className="section-title"> Monthly Income vs Expense</h2>
            <p className="chart-description">
             Compare your monthly income and expenses
            </p>
          </div>
        </div>

        {monthlyReport.length === 0 ? (
          <p className="empty-message">
            No monthly expense data available.
          </p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid
                  stroke="#343b49"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fill: "#aab3c5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#aab3c5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Expense",
                  ]}
                  contentStyle={{
                    backgroundColor: "#202938",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />
                <Bar
                  dataKey="totalExpense"
                  name="Total Expense"
                  fill="#818cf8"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={64}
                />

                <Bar
                  dataKey="totalIncome"
                  name="Total Income"
                  fill="#34d399"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={64}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      
      <section className="dashboard-section chart-card category-card">
        <div className="chart-header">
          <div>
            <h2 className="section-title">Category Breakdown</h2>
            <p className="chart-description">
              See where your money is going
            </p>
          </div>
        </div>

        {categoryReport.length === 0 ? (
          <p className="empty-message">
            No category expense data available.
          </p>
        ) : (
          <div className="category-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryReport}
                  dataKey="totalExpense"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  innerRadius="48%"
                  paddingAngle={3}
                >
                  {categoryReport.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={
                        [
                          "#818cf8",
                          "#34d399",
                          "#fbbf24",
                          "#f87171",
                          "#38bdf8",
                          "#c084fc",
                          "#fb923c",
                          "#94a3b8",
                        ][index % 8]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#202938",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span style={{ color: "#cbd5e1" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

    
      <section className="dashboard-section chart-card recent-transactions">
        <div className="chart-header">
          <div>
            <h2 className="section-title">Recent Transactions</h2>
            <p className="chart-description">
              Your latest 5 transaction
            </p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="empty-message">
            No recent transactions available.
          </p>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div className="transaction-item" key={transaction._id}>
                <div className="transaction-info">
                  <h3 className="transaction-title">
                    {transaction.title}
                  </h3>

                  <p className="transaction-meta">
                    {transaction.category} ·{" "}
                    {new Date(transaction.transactionDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
               
                <p
                  className="transaction-amount"
                  style={{
                    color: transaction.type === "income" ? "#34d399" : "#fca5a5",
                  }}
                >
                  {transaction.type === "income" ? "+" : "−"}₹
                  {Number(transaction.amount).toLocaleString("en-IN")}
                </p>

              </div>
            ))}
          </div>
        )}
      </section>


    </div>
  );
}

export default Dashboard;
