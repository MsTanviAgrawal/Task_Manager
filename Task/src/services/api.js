const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 30000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned invalid content type");
  }

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || data.details || "Something went wrong";
    throw new Error(errorMsg);
  }
  return data;
};

export const authAPI = {
  login: async (username, password) => {
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetchWithTimeout(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

export const taskAPI = {
  getDashboardSummary: async () => {
    try {
      const response = await fetchWithTimeout(`${API_URL}/tasks/dashboard-summary`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      return await handleResponse(response);
    } catch (error) {
      console.warn("Primary dashboard endpoint failed, using fallback:", error.message);

      try {
        const response = await fetchWithTimeout(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        const tasks = await handleResponse(response);
        const tasksArray = Array.isArray(tasks) ? tasks : [];

        const stats = {
          total: tasksArray.length,
          pending: tasksArray.filter(t => t.status === 'pending').length,
          inProgress: tasksArray.filter(t => t.status === 'in-progress' || t.status === 'inProgress').length,
          completed: tasksArray.filter(t => t.status === 'completed').length,
          overdue: tasksArray.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
          byPriority: {
            low: tasksArray.filter(t => t.priority === 'low').length,
            medium: tasksArray.filter(t => t.priority === 'medium').length,
            high: tasksArray.filter(t => t.priority === 'high').length,
            urgent: tasksArray.filter(t => t.priority === 'urgent').length,
          }
        };

        return {
          stats,
          recentTasks: tasksArray
            .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
            .slice(0, 5)
            .map(t => ({ ...t, id: t._id || t.id }))
        };
      } catch (fallbackError) {
        console.error("Critical failure: Fallback route /tasks also returned 500 error status.", fallbackError.message);
        
        return {
          stats: {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            overdue: 0,
            byPriority: { low: 0, medium: 0, high: 0, urgent: 0 }
          },
          recentTasks: []
        };
      }
    }
  },

  getAllTasks: async () => {
    const response = await fetchWithTimeout(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },

  getTaskById: async (id) => {
    const response = await fetchWithTimeout(`${API_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },

  createTask: async (taskData) => {
    const response = await fetchWithTimeout(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  updateTask: async (id, taskData) => {
    const response = await fetchWithTimeout(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  deleteTask: async (id) => {
    const response = await fetchWithTimeout(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },

  getTaskStats: async () => {
    const response = await fetchWithTimeout(`${API_URL}/tasks/stats`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};

export const userAPI = {
  getAllUsers: async () => {
    const response = await fetchWithTimeout(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },

  updateUserRole: async (userId, role) => {
    const response = await fetchWithTimeout(`${API_URL}/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await fetchWithTimeout(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return handleResponse(response);
  },
};
