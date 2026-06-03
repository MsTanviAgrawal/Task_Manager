import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import '../stylePages/Dashboard.css';
import { BiSolidBarChartSquare } from "react-icons/bi";
import { BsHourglassSplit } from "react-icons/bs";
import { MdRepeatOn } from "react-icons/md";
import { LuSquareCheckBig } from "react-icons/lu";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { LiaClipboardListSolid } from "react-icons/lia";
import { TbTargetArrow } from "react-icons/tb";
import { FcCalendar } from "react-icons/fc";
import { TbAlertTriangle } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";

const DEFAULT_STATS = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
  byPriority: { low: 0, medium: 0, high: 0, urgent: 0 }
};

function Dashboard({ currentUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setStats(DEFAULT_STATS);
      setRecentTasks([]);
      return;
    }
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await taskAPI.getDashboardSummary();
      setStats(data?.stats || DEFAULT_STATS);
      setRecentTasks(Array.isArray(data?.recentTasks) ? data.recentTasks : []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats(DEFAULT_STATS);
      setRecentTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isLoggedIn = Boolean(currentUser);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{isLoggedIn ? `Welcome, ${currentUser.username}! 👋` : 'Welcome to Task Manager 👋'}</h1>
        <p className="dashboard-subtitle">
          {isLoggedIn ? "Here's an overview of your tasks" : 'Sign in to create, track, and manage your tasks in one place.'}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon1"><BiSolidBarChartSquare /></div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon2"><BsHourglassSplit /></div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon3"><MdRepeatOn /></div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon4"><LuSquareCheckBig /></div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        {stats.overdue > 0 && (
          <div className="stat-card overdue">
            <div className="stat-icon5"><TbAlertTriangle /></div>
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
          {isLoggedIn && recentTasks.length > 0 && (
            <button onClick={() => navigate('/tasks')} className="btn-view-all">
              View All →
            </button>
          )}
        </div>
        
        {loading ? (
           <p>Loading tasks...</p>
        ) : recentTasks.length === 0 ? (
          <div className="empty-state">
            <p>{isLoggedIn ? 'No tasks yet. Create your first task!' : 'Log in to see your recent tasks and start managing work.'}</p>
            {isLoggedIn ? (
              <button onClick={() => navigate('/create')} className="btn-create-first">
                Create Task
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-create-first">
                Login to get started
              </button>
            )}
          </div>
        ) : (
          <div className="recent-tasks-list">
            {recentTasks.map(task => (
              <div key={task.id || task._id} className="recent-task-item">
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
                      <FcCalendar className="due-date-badge-icon" /> 
                      {formatDate(task.dueDate)}
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
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate('/create')} className="action-btn create">
                <span className="action-icon"><MdOutlineLibraryAdd /></span>
                Create Task
              </button>
              <button onClick={() => navigate('/tasks')} className="action-btn view">
                <span className="action-icon"><LiaClipboardListSolid /></span>
                View All Tasks
              </button>
              <button onClick={() => navigate('/priority')} className="action-btn priority">
                <span className="action-icon"><TbTargetArrow /></span>
                Priority Board
              </button>
              {currentUser.role === 'admin' && (
                <button onClick={() => navigate('/users')} className="action-btn users">
                  <span className="action-icon"><FiUsers /></span>
                  Manage Users
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="action-btn create">
                <span className="action-icon"><MdOutlineLibraryAdd /></span>
                Login
              </button>
              <button onClick={() => navigate('/register')} className="action-btn view">
                <span className="action-icon"><LiaClipboardListSolid /></span>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
