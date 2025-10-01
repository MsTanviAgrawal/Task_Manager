import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI, userAPI } from '../services/api';
import '../stylePages/TaskForm.css';

function TaskForm({ currentUser, onTaskCreated, editingTask, onTaskUpdated, onCancel }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser.role === 'admin') {
        try {
          const data = await userAPI.getAllUsers();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
      setAssignedTo(editingTask.assignedTo || '');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (!dueDate) {
      setError('Please select a due date');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      assignedTo: assignedTo || currentUser.id
    };

    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask.id, taskData);
        onTaskUpdated();
      } else {
        await taskAPI.createTask(taskData);
        onTaskCreated();
      }

      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setAssignedTo('');
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Failed to save task');
    }
  };

  return (
    <div className="task-form-container">
      <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date *</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {currentUser.role === 'admin' && (
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id || user.id} value={user._id || user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
          {editingTask && (
            <button type="button" className="btn-cancel" onClick={() => { onCancel(); navigate('/tasks'); }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
