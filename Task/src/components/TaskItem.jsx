import '../stylePages/TaskItem.css';

function TaskItem({ task, currentUser, onView, onEdit, onDelete, onStatusUpdate }) {
  const getPriorityClass = (priority) => {
    return `priority-badge priority-${priority}`;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = () => {
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  };

  return (
    <div className={`task-item ${isOverdue() ? 'overdue' : ''}`}>
      <div className="task-item-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-badges">
          <span className={getPriorityClass(task.priority)}>
            {task.priority}
          </span>
          <span className={getStatusClass(task.status)}>
            {task.status}
          </span>
        </div>
      </div>

      <p className="task-description">
        {task.description || 'No description provided'}
      </p>

      <div className="task-meta">
        <div className="task-date">
          <strong>Due:</strong> {formatDate(task.dueDate)}
          {isOverdue() && <span className="overdue-label">OVERDUE</span>}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={onView} className="btn-action btn-view">
          View Details
        </button>
        <button onClick={onEdit} className="btn-action btn-edit">
          Edit
        </button>
        <button onClick={onDelete} className="btn-action btn-delete">
          Delete
        </button>
        
        <select
          value={task.status}
          onChange={(e) => onStatusUpdate(task.id, e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}

export default TaskItem;
