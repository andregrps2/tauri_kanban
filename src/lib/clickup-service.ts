// A wrapper for the ClickUp API
// NOTE: This is a simplified client for demonstration purposes.
// A production implementation should have more robust error handling, etc.

const API_BASE_URL = 'https://api.clickup.com/api/v2';

// Helper to get credentials from environment variables
function getCredentials() {
  const token = process.env.NEXT_PUBLIC_CLICKUP_API_TOKEN;
  const listId = process.env.NEXT_PUBLIC_CLICKUP_LIST_ID;
  return { token, listId };
}

// Reusable fetch function
async function fetchClickUpAPI(endpoint: string, options: RequestInit = {}) {
  const { token } = getCredentials();
  if (!token) {
    throw new Error("ClickUp API token not found. Please set NEXT_PUBLIC_CLICKUP_API_TOKEN in your .env.local file.");
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      console.error("ClickUp API Error:", errorData);
      throw new Error(errorData.err || `HTTP error! status: ${response.status}`);
    } catch (e) {
      // If response is not JSON, or some other error occurs
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // For requests like DELETE which might not have a body
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return;
  }
  
  return response.json();
}

// Get statuses (columns) for the configured list
export async function getListStatuses() {
  const { listId } = getCredentials();
  if (!listId) {
    throw new Error("ClickUp List ID not found. Please set NEXT_PUBLIC_CLICKUP_LIST_ID in your .env.local file.");
  }
  const listData = await fetchClickUpAPI(`/list/${listId}`);
  return listData.statuses || [];
}

// Get all tasks for the configured list
export async function getTasks() {
  const { listId } = getCredentials();
  if (!listId) {
    throw new Error("ClickUp List ID not found. Please set NEXT_PUBLIC_CLICKUP_LIST_ID in your .env.local file.");
  }
  // Added include_checklists=true to the query parameters
  const { tasks } = await fetchClickUpAPI(`/list/${listId}/task?subtasks=true&include_checklists=true`);
  return tasks;
}

// Get a single task's details
export async function getTask(taskId: string) {
    // Ensure we also fetch attachments
    return fetchClickUpAPI(`/task/${taskId}?subtasks=true&include_checklists=true`);
}


export async function createTask(title: string, status: string) {
  const { listId } = getCredentials();
   if (!listId) {
    throw new Error("ClickUp List ID not found. Please set NEXT_PUBLIC_CLICKUP_LIST_ID in your .env.local file.");
  }
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

// Get comments for a specific task
export async function getTaskComments(taskId: string) {
    const data = await fetchClickUpAPI(`/task/${taskId}/comment`);
    return data.comments || [];
}

// Create a comment on a specific task
export async function createTaskComment(taskId: string, commentText: string) {
    return fetchClickUpAPI(`/task/${taskId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ comment_text: commentText }),
    });
}

// --- Checklist Functions ---

export async function createChecklist(taskId: string, name: string) {
  const response = await fetchClickUpAPI(`/task/${taskId}/checklist`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return response.checklist;
}


export async function deleteChecklist(checklistId: string) {
  return fetchClickUpAPI(`/checklist/${checklistId}`, {
    method: 'DELETE',
  });
}

export async function createChecklistItem(checklistId: string, name: string, orderindex?: number) {
  const response = await fetchClickUpAPI(`/checklist/${checklistId}/checklist_item`, {
    method: 'POST',
    body: JSON.stringify({ name, orderindex }),
  });
  return response.item;
}

export async function updateChecklistItem(checklistId: string, checklistItemId: string, data: { name?: string, resolved?: boolean }) {
  return fetchClickUpAPI(`/checklist/${checklistId}/checklist_item/${checklistItemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteChecklistItem(checklistId: string, checklistItemId: string) {
  return fetchClickUpAPI(`/checklist/${checklistId}/checklist_item/${checklistItemId}`, {
    method: 'DELETE',
  });
}
