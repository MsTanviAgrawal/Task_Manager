import Task from "../models/Task.js";
import User from "../models/User.js";

export const getAllTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate({
        path: "assignedTo",
        select: "username email",
        options: { strictPopulate: false },
      })
      .populate({
        path: "createdBy",
        select: "username email",
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 });

    res.json(tasks || []);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo && 
      task.assignedTo._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error fetching task" });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority: priority || "medium",
      status: "pending",
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id,
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.assignedTo && 
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (assignedTo && req.user.role === "admin") task.assignedTo = assignedTo;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "admin" &&
      task.createdBy && 
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error deleting task" });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query.assignedTo = req.user.id;
    }

    const [
      recentTasks,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      lowTasks,
      mediumTasks,
      highTasks,
      urgentTasks,
    ] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: "assignedTo",
          select: "username email",
          options: { strictPopulate: false },
        })
        .populate({
          path: "createdBy",
          select: "username email",
          options: { strictPopulate: false },
        })
        .lean(),
      Task.countDocuments(query),
      Task.countDocuments({ ...query, status: "pending" }),
      Task.countDocuments({ ...query, status: "in-progress" }),
      Task.countDocuments({ ...query, status: "completed" }),
      Task.countDocuments({
        ...query,
        status: { $ne: "completed" },
        dueDate: { $lt: new Date() },
      }),
      Task.countDocuments({ ...query, priority: "low" }),
      Task.countDocuments({ ...query, priority: "medium" }),
      Task.countDocuments({ ...query, priority: "high" }),
      Task.countDocuments({ ...query, priority: "urgent" }),
    ]);

    const safeRecentTasks = Array.isArray(recentTasks) ? recentTasks : [];

    res.json({
      stats: {
        total: totalTasks || 0,
        pending: pendingTasks || 0,
        inProgress: inProgressTasks || 0,
        completed: completedTasks || 0,
        overdue: overdueTasks || 0,
        byPriority: {
          low: lowTasks || 0,
          medium: mediumTasks || 0,
          high: highTasks || 0,
          urgent: urgentTasks || 0,
        },
      },
      recentTasks: safeRecentTasks.map((task) => ({
        ...task,
        id: task?._id || task?.id,
      })),
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);
    res.status(500).json({ message: "Server error fetching dashboard summary" });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== "admin") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query);
    const tasksArray = Array.isArray(tasks) ? tasks : [];

    const stats = {
      total: tasksArray.length,
      pending: tasksArray.filter((t) => t.status === "pending").length,
      inProgress: tasksArray.filter((t) => t.status === "in-progress" || t.status === "inProgress").length,
      completed: tasksArray.filter((t) => t.status === "completed").length,
      overdue: tasksArray.filter(
        (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed",
      ).length,
      byPriority: {
        low: tasksArray.filter((t) => t.priority === "low").length,
        medium: tasksArray.filter((t) => t.priority === "medium").length,
        high: tasksArray.filter((t) => t.priority === "high").length,
        urgent: tasksArray.filter((t) => t.priority === "urgent").length,
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error fetching statistics" });
  }
};
