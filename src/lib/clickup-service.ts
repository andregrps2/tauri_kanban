// A wrapper for the ClickUp API
// NOTE: This is a simplified client for demonstration purposes.
// A production implementation should have more robust error handling, etc.

const API_BASE_URL = 'https://api.clickup.com/api/v2';

// Helper to get credentials from localStorage
function getCredentials() {
  if (typeof window === 'undefined') {
    return { token: null, listId: null };
  }
  const token = localStorage.getItem('clickup_api_token');
  const listId = localStorage.getItem('clickup_list_id');
  return { token, listId };
}

// Reusable fetch function
async function fetchClickUpAPI(endpoint: string, options: RequestInit = {}) {
  const { token } = getCredentials();
  if (!token) {
    throw new Error("ClickUp API token not found. Please set it in Settings.");
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("ClickUp API Error:", errorData);
    throw new Error(errorData.err || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Get statuses (columns) for the configured list
export async function getListStatuses() {
  const { listId } = getCredentials();
  if (!listId) {
    throw new Error("ClickUp List ID not found. Please set it in Settings.");
  }
  const { statuses } = await fetchClickUpAPI(`/list/${listId}`);
  return statuses;
}

// Get tasks for the configured list
export async function getTasks() {
  const { listId } = getCredentials();
  if (!listId) {
    throw new Error("ClickUp List ID not found. Please set it in Settings.");
  }
  // This will fetch tasks from all statuses
  const { tasks } = await fetchClickUpAPI(`/list/${listId}/task`);
  return tasks;
}

// --- Placeholder functions for future implementation ---

export async function createTask(title: string, status: string) {
  const { listId } = getCredentials();
  return fetchClickUpAPI(`/list/${listId}/task`, {
    method: 'POST',
    body: JSON.stringify({ name: title, status }),
  });
}

export async function updateTask(taskId: string, data: any) {
  return fetchClickUpAPI(`/task/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTask(taskId: string) {
  return fetchClickUpAPI(`/task/${taskId}`, {
    method: 'DELETE',
  });
}
