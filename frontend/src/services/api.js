const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const uploadCsvFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload-csv`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to upload CSV file');
  }

  return await response.json();
};

const fetchJson = async (endpoint) => {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return await res.json();
};

export const checkHealth = async () => {
  return await fetchJson(`${API_BASE_URL}/api/health`);
};

export const fetchDashboardData = async () => {
  // Fire all API requests in parallel for maximum speed
  const [summary, monthly, category, forecast, recommendation, allTransactions] = await Promise.all([
    fetchJson(`${API_BASE_URL}/api/summary`),
    fetchJson(`${API_BASE_URL}/api/monthly-analytics`),
    fetchJson(`${API_BASE_URL}/api/category-breakdown`),
    fetchJson(`${API_BASE_URL}/api/income-forecast`),
    fetchJson(`${API_BASE_URL}/api/recommendation`),
    fetchJson(`${API_BASE_URL}/api/transactions`)
  ]);
  
  return { summary, monthly, category, forecast, recommendation, allTransactions };
};
