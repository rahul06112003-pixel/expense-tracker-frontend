import { useCallback, useEffect, useState } from "react";
import { getExpenses, createExpense, deleteExpense, updateExpense } from "../services/expenseService";


function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    note: "",
    transactionDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalExpenses: 0,
    totalPages: 0,
  });
  const [refreshing, setRefreshing] = useState(false);


  function handleChange(event) {
   const { name, value } = event.target;

   setFormData((previousData) => ({
    ...previousData,
    [name]: value,
   }));
  }


 async function handleSubmit(event) {
  event.preventDefault();

  if(submitting) return;

  setSubmitting(true);

  try {
    const expenseData = {
      ...formData,
      amount: Number(formData.amount),
    };

    if (!expenseData.transactionDate) {
      delete expenseData.transactionDate;
    }

   let data;

    if (editingExpenseId) {
      data = await updateExpense(editingExpenseId, expenseData);
    } else {
      data = await createExpense(expenseData);
    } 

   await fetchExpenses();

   setError("");

   resetForm();
   console.log(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setSubmitting(false);
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

  setEditingExpenseId(null);
 }


 async function handleDelete(id) {
  try {
    await deleteExpense(id);
    setError("");
    await fetchExpenses();

  } catch (error) {
    setError(error.message);
  }
 }

  
  const fetchExpenses = useCallback(async() => {
    if (loading) {
     setRefreshing(false);
    } else {
     setRefreshing(true);
    }

    try {
      const data = await getExpenses({
       page: currentPage,
       limit: 10,
       search: debouncedSearch,
       category: categoryFilter,
       sort: sortOption === "newest"
        ? "-transactionDate"
        : sortOption === "oldest"
        ? "transactionDate"
        : sortOption === "high"
        ? "-amount"
        : "amount",
      });

      setExpenses(data.expense);
      setPagination(data.pagination);
      setError("");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, debouncedSearch, categoryFilter, sortOption]);


 useEffect(() => {
  fetchExpenses();
 }, [fetchExpenses]);


 useEffect(() => {
  setCurrentPage(1);
 }, [debouncedSearch, categoryFilter, sortOption]);


 useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 400);
  return () => clearTimeout(timer);
 }, [searchTerm]);


 if (loading) {
  return <p>Loading expenses...</p>;
 }


 return (
  <div className="expenses-page">
    <h1 className="page-title">Expenses</h1>

    {error && (
     <p className="error-message" role="alert">
      {error}
     </p>
    )}

    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Burger"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="e.g. 500"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Note</label>
          <input
            type="text"
            name="note"
            placeholder="e.g. Dinner"
            value={formData.note}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Transaction Date</label>
          <input
            type="date"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={submitting}>
        {submitting
          ? "Saving..."
          : editingExpenseId
            ? "Update Expense"
            : "Add Expense"}
      </button>

      {editingExpenseId && (
        <button
          type="button"
          className="cancel-btn"
          onClick={resetForm}
          disabled={submitting}
        >
          Cancel Edit
        </button>
      )}
    </form>

   <section className="expense-section">
     <input
      type="text"
      placeholder="Search expenses..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
     />

     <select
      value={categoryFilter}
      onChange={(event) => setCategoryFilter(event.target.value)}
     >
      <option value="All">All Categories</option>
      <option value="Food">Food</option>
      <option value="Travel">Travel</option>
      <option value="Shopping">Shopping</option>
      <option value="Bills">Bills</option>
      <option value="Entertainment">Entertainment</option>
      <option value="Health">Health</option>
      <option value="Education">Education</option>
      <option value="Other">Other</option>
     </select>

     <select
      value={sortOption}
      onChange={(event) => setSortOption(event.target.value)}
     >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="high">Amount: High to Low</option>
      <option value="low">Amount: Low to High</option>
     </select>

      <h2>Your Expenses</h2>

      {refreshing && (
        <p className="refreshing-message">
         Updating expenses...
        </p>
      )}

      <div className="pagination">
       <button
        onClick={() => setCurrentPage((page) => page - 1)}
        disabled={currentPage === 1}
       >
       Previous
       </button>

       <span>
        Page {currentPage} of {pagination.totalPages}
       </span>

       <button
        onClick={() => setCurrentPage((page) => page + 1)}
        disabled={currentPage === pagination.totalPages}
       >
       Next
       </button>
      </div>

      {expenses.length === 0 ? (
        <p className="empty-message">No expenses found.</p>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
           <div className="expense-card" key={expense._id}>
           <div className="expense-card-header">
            <h3>{expense.title}</h3>

            <span className="expense-amount">
             ₹{expense.amount}
            </span>
           </div>

            <p className="expense-category">
             {expense.category}
            </p>

            <p className="expense-note">
             {expense.note || "No note"}
            </p>

            <p className="expense-date">
             {expense.transactionDate
             ? new Date(expense.transactionDate).toLocaleDateString()
             : "No date"}
            </p>

            <button
              className="edit-btn"
              onClick={() => {
               setEditingExpenseId(expense._id);
               setFormData({
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                note: expense.note || "",
                transactionDate: expense.transactionDate
                 ? new Date(expense.transactionDate)
                 .toISOString()
                 .split("T")[0]
                : "",
               });
              }}
            >
             Edit
            </button>

            <button
             className="delete-btn"
             onClick={() => handleDelete(expense._id)}
            >
             Delete
            </button>
           </div>
          ))}
        </div>
      )}
    </section>
  </div>
 );
}

export default Expenses;

