import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import '../stylePages/Dashboard.css';

function Dashboard({ currentUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 }
  });

  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      const [tasksData, statsData] = await Promise.all([
        taskAPI.getAllTasks(),
        taskAPI.getTaskStats()
      ]);

      setStats(statsData);

      const recent = tasksData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(task => ({
          ...task,
          id: task._id
        }));
      setRecentTasks(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser.username}! 👋</h1>
        <p className="dashboard-subtitle">Here's an overview of your tasks</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        {stats.overdue > 0 && (
          <div className="stat-card overdue">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{stats.overdue}</h3>
              <p>Overdue</p>
            </div>
          </div>
        )}
      </div>

      <div className="priority-stats">
        <h2>Tasks by Priority</h2>
        <div className="priority-bars">
          {Object.entries(stats.byPriority).map(([priority, count]) => (
            <div key={priority} className="priority-bar-item">
              <div className="priority-label">
                <span className={`priority-dot priority-${priority}`}></span>
                <span>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
              </div>
              <div className="priority-bar-container">
                <div 
                  className={`priority-bar priority-${priority}`}
                  style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="priority-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-tasks-section">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <button onClick={() => navigate('/tasks')} className="btn-view-all">
            View All →
          </button>
        </div>
        
        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create your first task!</p>
            <button onClick={() => navigate('/create')} className="btn-create-first">
              Create Task
            </button>
          </div>
        ) : (
          <div className="recent-tasks-list">
            {recentTasks.map(task => (
              <div key={task.id} className="recent-task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <div className="task-meta-inline">
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge status-${task.status}`}>
                      {task.status}
                    </span>
                    <span className="due-date-badge">
                      📅 {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/create')} className="action-btn create">
            <span className="action-icon">➕</span>
            Create Task
          </button>
          <button onClick={() => navigate('/tasks')} className="action-btn view">
            <span className="action-icon">📋</span>
            View All Tasks
          </button>
          <button onClick={() => navigate('/priority')} className="action-btn priority">
            <span className="action-icon">🎯</span>
            Priority Board
          </button>
          {currentUser.role === 'admin' && (
            <button onClick={() => navigate('/users')} className="action-btn users">
              <span className="action-icon">👥</span>
              Manage Users
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
