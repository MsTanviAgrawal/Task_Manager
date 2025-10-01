import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskItem from './TaskItem';
import Pagination from './Pagination';
import '../stylePages/TaskList.css';

function TaskList({ currentUser, onViewTask, onEditTask, onDeleteTask, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const tasksPerPage = 5;

  useEffect(() => {
    loadTasks();
  }, [currentUser, refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filterStatus, filterPriority, searchQuery]);

  const loadTasks = async () => {
    try {
      const data = await taskAPI.getAllTasks();
      const formattedTasks = data.map(task => ({
        ...task,
        id: task._id,
        assignedTo: task.assignedTo._id || task.assignedTo,
        createdBy: task.createdBy._id || task.createdBy
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>My Tasks</h2>
        <div className="task-stats">
          <span className="stat">Total: {filteredTasks.length}</span>
          <span className="stat pending">Pending: {filteredTasks.filter(t => t.status === 'pending').length}</span>
          <span className="stat completed">Completed: {filteredTasks.filter(t => t.status === 'completed').length}</span>
        </div>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="tasks-grid">
        {currentTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found</p>
          </div>
        ) : (
          currentTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              currentUser={currentUser}
              onView={() => onViewTask(task)}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
              onStatusUpdate={handleStatusUpdate}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default TaskList;
