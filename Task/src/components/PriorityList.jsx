import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import '../stylePages/PriorityList.css';

function PriorityList({ currentUser, onTaskClick, refreshTrigger }) {
  const [tasksByPriority, setTasksByPriority] = useState({
    low: [],
    medium: [],
    high: [],
    urgent: []
  });

  const priorityConfig = {
    low: { color: '#28a745', label: 'Low Priority' },
    medium: { color: '#ffc107', label: 'Medium Priority' },
    high: { color: '#fd7e14', label: 'High Priority' },
    urgent: { color: '#dc3545', label: 'Urgent' }
  };

  useEffect(() => {
    loadTasksByPriority();
  }, [currentUser, refreshTrigger]);

  const loadTasksByPriority = async () => {
    try {
      const data = await taskAPI.getAllTasks();
      const formattedTasks = data.map(task => ({
        ...task,
        id: task._id
      }));

      const grouped = {
        low: formattedTasks.filter(t => t.priority === 'low' && t.status !== 'completed'),
        medium: formattedTasks.filter(t => t.priority === 'medium' && t.status !== 'completed'),
        high: formattedTasks.filter(t => t.priority === 'high' && t.status !== 'completed'),
        urgent: formattedTasks.filter(t => t.priority === 'urgent' && t.status !== 'completed')
      };

      setTasksByPriority(grouped);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newPriority) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData('task'));
    
    if (task.priority !== newPriority) {
      try {
        await taskAPI.updateTask(task.id, { priority: newPriority });
        
        const updatedTask = { ...task, priority: newPriority, updatedAt: new Date().toISOString() };
        
        setTasksByPriority(prevTasks => {
          const oldPriorityTasks = prevTasks[task.priority].filter(t => t.id !== task.id);
          const newPriorityTasks = [...prevTasks[newPriority], updatedTask];
          
          return {
            ...prevTasks,
            [task.priority]: oldPriorityTasks,
            [newPriority]: newPriorityTasks
          };
        });
      } catch (error) {
        console.error('Error updating task priority:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="priority-list-container">
      <h2>Priority Management</h2>
      <p className="drag-hint">Drag tasks between priority lists to change priority</p>
      
      <div className="priority-columns">
        {Object.entries(priorityConfig).map(([priority, config]) => (
          <div
            key={priority}
            className="priority-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, priority)}
            style={{ borderTopColor: config.color }}
          >
            <div className="priority-header" style={{ backgroundColor: config.color }}>
              <h3>{config.label}</h3>
              <span className="task-count">{tasksByPriority[priority].length}</span>
            </div>

            <div className="priority-tasks">
              {tasksByPriority[priority].length === 0 ? (
                <div className="empty-state">No tasks</div>
              ) : (
                tasksByPriority[priority].map(task => (
                  <div
                    key={task.id}
                    className="priority-task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => onTaskClick(task)}
                  >
                    <h4>{task.title}</h4>
                    <div className="task-card-meta">
                      <span className="due-date">📅 {formatDate(task.dueDate)}</span>
                      <span className={`status-dot status-${task.status}`}></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriorityList;
