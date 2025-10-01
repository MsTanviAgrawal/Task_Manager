import { useEffect, useState } from 'react';
import '../stylePages/TaskDetails.css';

function TaskDetails({ task, onClose, onEdit, onDelete, currentUser }) {
  const [assignedUser, setAssignedUser] = useState(null);

  useEffect(() => {
    if (task.assignedTo) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === task.assignedTo);
      setAssignedUser(user);
    }
  }, [task]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      urgent: '#dc3545'
    };
    return colors[priority] || '#6c757d';
  };

  const isOverdue = () => {
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  return (
    <div className="task-details-overlay" onClick={onClose}>
      <div className="task-details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="task-details-header">
          <h2>{task.title}</h2>
          <div className="header-badges">
            <span 
              className="priority-indicator" 
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </span>
            <span className={`status-indicator status-${task.status}`}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="task-details-content">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{task.description || 'No description provided'}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <label>Due Date</label>
              <p className={isOverdue() ? 'overdue-text' : ''}>
                {formatDate(task.dueDate)}
                {isOverdue() && <span className="overdue-badge">OVERDUE</span>}
              </p>
            </div>

            <div className="detail-item">
              <label>Priority</label>
              <p style={{ color: getPriorityColor(task.priority), fontWeight: 600 }}>
                {task.priority.toUpperCase()}
              </p>
            </div>

            <div className="detail-item">
              <label>Status</label>
              <p className={`status-text status-${task.status}`}>
                {task.status.replace('-', ' ').toUpperCase()}
              </p>
            </div>

            {assignedUser && (
              <div className="detail-item">
                <label>Assigned To</label>
                <p>{assignedUser.username} ({assignedUser.email})</p>
              </div>
            )}

            <div className="detail-item">
              <label>Created At</label>
              <p>{formatDate(task.createdAt)}</p>
            </div>

            {task.updatedAt && (
              <div className="detail-item">
                <label>Last Updated</label>
                <p>{formatDate(task.updatedAt)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="task-details-actions">
          <button onClick={onEdit} className="btn-edit-modal">
            Edit Task
          </button>
          <button onClick={onDelete} className="btn-delete-modal">
            Delete Task
          </button>
          <button onClick={onClose} className="btn-close-modal">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
