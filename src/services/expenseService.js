import apiRequest from "./api";


export async function getExpenses({
  page = 1,
  limit = 10,
  search = "",
  category = "All",
  sort = "-transactionDate",
  startDate,
  endDate,
} = {}) {
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("limit", limit);
  params.set("sort", sort);

  if (search.trim()) params.set("search", search.trim());
  if (category !== "All") params.set("category", category);

  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  return apiRequest(`/expense?${params.toString()}`);
}


export async function createExpense(expenseData) {
  return apiRequest("/expense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  });
}

export async function deleteExpense(id) {
  return apiRequest(`/expense/${id}`, {
    method: "DELETE",
  });
}

export async function updateExpense(id, expenseData) {
  return apiRequest(`/expense/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  });
}