export const uploadCsvFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload-csv', {
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
  return await fetchJson('/api/health');
};

export const fetchDashboardData = async () => {
  // Fire all API requests in parallel for maximum speed
  const [summary, monthly, category, forecast, recommendation, allTransactions] = await Promise.all([
    fetchJson('/api/summary'),
    fetchJson('/api/monthly-analytics'),
    fetchJson('/api/category-breakdown'),
    fetchJson('/api/income-forecast'),
    fetchJson('/api/recommendation'),
    fetchJson('/api/transactions')
  ]);
  
  return { summary, monthly, category, forecast, recommendation, allTransactions };
};
