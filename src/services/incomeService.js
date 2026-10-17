import apiRequest from "./api";


export async function getIncome({
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

  return apiRequest(`/income?${params.toString()}`);
}


export async function createIncome(incomeData) {
  return apiRequest("/income", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incomeData),
  });
}


export async function updateIncome(id, incomeData) {
  return apiRequest(`/income/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incomeData),
  });
}


export async function deleteIncome(id) {
  return apiRequest(`/income/${id}`, {
    method: "DELETE",
  });
}