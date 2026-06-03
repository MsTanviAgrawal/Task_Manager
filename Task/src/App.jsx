import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { taskAPI } from './services/api';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';
import PriorityList from './components/PriorityList';
import UserManagement from './components/UserManagement';
import ConfirmDialog from './components/ConfirmDialog';

function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AuthPage({ mode, onAuthSuccess }) {
  const [showAuth, setShowAuth] = useState(mode);
  const navigate = useNavigate();

  const handleAuthSuccess = (user, token) => {
    onAuthSuccess(user, token);
    navigate('/dashboard');
  };

  return (
    <div className="app auth-page">
      {showAuth === 'login' ? (
        <Login
          onLogin={(user, token) => {
            handleAuthSuccess(user, token);
          }}
          onSwitchToRegister={() => setShowAuth('register')}
        />
      ) : (
        <Register
          onRegister={(user, token) => {
            handleAuthSuccess(user, token);
          }}
          onSwitchToLogin={() => setShowAuth('login')}
        />
      )}
    </div>
  );
}

function AppContent({ currentUser, setCurrentUser, onAuthSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/dashboard');
  };

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTaskUpdated = (updatedTask) => {
    setEditingTask(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    navigate('/create');
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await taskAPI.deleteTask(taskToDelete.id);
        setTaskToDelete(null);
        setSelectedTask(null);
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert(error.message || 'Failed to delete task');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const showShell = !['/login', '/register'].includes(location.pathname);

  return (
    <div className="app">
      {showShell && (
        <Navigation
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
          <Route path="/login" element={<AuthPage mode="login" onAuthSuccess={onAuthSuccess} />} />
          <Route path="/register" element={<AuthPage mode="register" onAuthSuccess={onAuthSuccess} />} />

          <Route
            path="/create"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <TaskForm
                  currentUser={currentUser}
                  onTaskCreated={handleTaskCreated}
                  editingTask={editingTask}
                  onTaskUpdated={handleTaskUpdated}
                  onCancel={handleCancelEdit}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <TaskList
                  currentUser={currentUser}
                  onViewTask={handleViewTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  refreshTrigger={refreshTrigger}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/priority"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <PriorityList
                  currentUser={currentUser}
                  onTaskClick={handleViewTask}
                  refreshTrigger={refreshTrigger}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <UserManagement currentUser={currentUser} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onEdit={() => handleEditTask(selectedTask)}
          onDelete={() => handleDeleteTask(selectedTask)}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete the task "${taskToDelete.title}"? This action cannot be undone.`}
          onConfirm={confirmDeleteTask}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {showShell && (
        <footer className="app-footer">
          <p>© 2025 Task Manager. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
      console.error('Failed to restore user session:', error);
      return null;
    }
  });

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <BrowserRouter>
      <AppContent
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onAuthSuccess={handleAuthSuccess}
      />
    </BrowserRouter>
  );
}

export default App;
