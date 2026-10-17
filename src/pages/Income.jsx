import { useState, useEffect, useCallback } from "react";
import {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../services/incomeService";

function Income() {
    const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Salary",
    note: "",
    transactionDate: "",
    });
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingIncomeId, setEditingIncomeId] = useState(null);


    function handleChange(event) {
     const { name, value } = event.target;

     setFormData((previousData) => ({
        ...previousData,
        [name]: value,
     }));
    }


    async function handleSubmit(event) {
     event.preventDefault();

     const incomeData = {
        ...formData,
        amount: Number(formData.amount),
     };

     if (!incomeData.transactionDate) {
        delete incomeData.transactionDate;
     }

     try {
        if (editingIncomeId) {
          await updateIncome(editingIncomeId, incomeData);
        } else {
          await createIncome(incomeData);
        }

        resetForm();

        await fetchIncomes();
      } catch (error) {
        console.error(error.message);
      }
    }

    
    function resetForm() {
     setFormData({
      title: "",
      amount: "",
      category: "Salary",
      note: "",
      transactionDate: "",
     });

     setEditingIncomeId(null);
    }


    const fetchIncomes = useCallback(async () => {
      try {
        const data = await getIncome();
        setIncomes(data.income);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }, []);


    async function handleDelete(id) {
      try {
        await deleteIncome(id);
        setError("");
        await fetchIncomes();
      } catch (error) {
        setError(error.message);
      }
    }


    useEffect(() => {
     fetchIncomes();
    }, [fetchIncomes]);


  return (
    <div className="income-page">
      <h1 className="page-title">Income</h1>

      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>Add Income</h2>
        
        <div className="form-grid">
        {/* Title */}
        <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g. Internship Salary"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={100}
            />
        </div>

        {/* Amount */}
        <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
            type="number"
            id="amount"
            name="amount"
            placeholder="e.g. 15000"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            />
        </div>

        {/* Category */}
        <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            >
            <option value="Salary">Salary</option>
            <option value="Freelancing">Freelancing</option>
            <option value="Business">Business</option>
            <option value="Investment Returns">Investment Returns</option>
            <option value="Other">Other</option>
            </select>
        </div>

        {/* Note */}
        <div className="form-group">
            <label htmlFor="note">Note</label>
            <input
            type="text"
            id="note"
            name="note"
            placeholder="e.g. October salary"
            value={formData.note}
            onChange={handleChange}
            maxLength={500}
            />
        </div>

        {/* Transaction Date */}
        <div className="form-group">
            <label htmlFor="transactionDate">Transaction Date</label>
            <input
            type="date"
            id="transactionDate"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            />
        </div>
        </div>

        <button className="submit-btn" type="submit">
         {editingIncomeId ? "Update Income" : "Add Income"}
        </button>
      </form>


      <section className="expense-section">
        <h2>Your Income</h2>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading income...</p>
        ) : incomes.length === 0 ? (
          <p className="empty-message">No income found.</p>
        ) : (
          <div className="expense-list">
            {incomes.map((income) => (
              <div className="expense-card" key={income._id}>
                <div className="expense-card-header">
                  <h3>{income.title}</h3>
                  <span className="expense-amount">
                    ₹{income.amount}
                  </span>
                </div>

                <p className="expense-category">{income.category}</p>
                <p className="expense-note">{income.note || "No note"}</p>

                <p className="expense-date">
                  {income.transactionDate
                    ? new Date(income.transactionDate).toLocaleDateString()
                    : "No date"}
                </p>
                  <button
                   className="delete-btn"
                   onClick={() => handleDelete(income._id)}
                  >
                   Delete
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingIncomeId(income._id);

                      setFormData({
                        title: income.title,
                        amount: income.amount,
                        category: income.category,
                        note: income.note || "",
                        transactionDate: income.transactionDate
                          ? new Date(income.transactionDate).toISOString().split("T")[0]
                          : "",
                      });
                    }}
                  >
                    Edit
                  </button>

                  {editingIncomeId && (
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={resetForm}
                    >
                      Cancel Edit
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Income;