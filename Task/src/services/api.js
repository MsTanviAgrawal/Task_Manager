const API_URL = '/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const handleResponse = async (response) => {
  console.log(`Response Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Error: Server did not return JSON. Content-Type:', contentType);
    throw new Error('Server returned invalid content type');
  }

  try {
    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data.message || data.details || 'Something went wrong';
      console.error(`API Error (${response.status}):`, errorMsg);
      throw new Error(errorMsg);
    }
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON response from server');
      throw new Error('Server returned invalid JSON response');
    }
    throw error;
  }
};

export const authAPI = {
  login: async (username, password) => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
};



export const taskAPI = {
  getAllTasks: async () => {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  getTaskById: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  createTask: async (taskData) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  updateTask: async (id, taskData) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  getTaskStats: async () => {
    const response = await fetch(`${API_URL}/tasks/stats`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
};

export const userAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },

  getUserTaskCount: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}/task-count`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
};
