
import apiRequest from "./api";

function buildReportUrl(path, filters = {}) {
  const params = new URLSearchParams();

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  const queryString = params.toString();

  return queryString
    ? `${path}?${queryString}`
    : path;
}

export async function getStatistics(filters = {}) {
  return apiRequest(buildReportUrl("/report/statistics", filters));
}

export async function getMonthlyReport(filters = {}) {
  return apiRequest(buildReportUrl("/report/monthly", filters));
}

export async function getMonthlyIncomeReport(filters = {}) {
  return apiRequest(buildReportUrl("/report/monthly-income", filters));
}

export async function getCategoryReport(filters = {}) {
  return apiRequest(buildReportUrl("/report/category", filters));
}
