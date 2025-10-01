import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState('login');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
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
    window.location.href = '/create';
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

  if (!currentUser) {
    return (
      <div className="app">
        {showAuth === 'login' ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowAuth('register')}
          />
        ) : (
          <Register
            onRegister={handleLogin}
            onSwitchToLogin={() => setShowAuth('login')}
          />
        )}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route 
              path="/dashboard" 
              element={<Dashboard currentUser={currentUser} />} 
            />
            
            <Route 
              path="/create" 
              element={
                <TaskForm
                  currentUser={currentUser}
                  onTaskCreated={handleTaskCreated}
                  editingTask={editingTask}
                  onTaskUpdated={handleTaskUpdated}
                  onCancel={handleCancelEdit}
                />
              } 
            />
            
            <Route 
              path="/tasks" 
              element={
                <TaskList
                  currentUser={currentUser}
                  onViewTask={handleViewTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  refreshTrigger={refreshTrigger}
                />
              } 
            />
            
            <Route 
              path="/priority" 
              element={
                <PriorityList
                  currentUser={currentUser}
                  onTaskClick={handleViewTask}
                  refreshTrigger={refreshTrigger}
                />
              } 
            />
            
            <Route 
              path="/users" 
              element={<UserManagement currentUser={currentUser} />} 
            />
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

        <footer className="app-footer">
          <p>© 2025 Task Manager. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
