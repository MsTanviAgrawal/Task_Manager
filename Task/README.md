# Task Management System

A comprehensive, full-featured task management application built with React and Vite. This system includes user authentication, task CRUD operations, priority management, and an admin panel for user management.

## 🚀 Features

### 1. **User Authentication**
- User login and registration
- Role-based access control (Admin/User)
- Persistent login sessions
- Demo admin account included

### 2. **Task Creation & Management**
- Create tasks with title, description, and due date
- Assign tasks to specific users (Admin only)
- Set task priorities (Low, Medium, High, Urgent)
- Automatic task assignment based on user role

### 3. **Task List with Pagination**
- View all tasks with pagination (5 tasks per page)
- Filter by status (Pending, In Progress, Completed)
- Filter by priority level
- Search functionality for task title and description
- Real-time task statistics

### 4. **Task Details View**
- Modal popup displaying complete task information
- Shows assigned user, creation date, and last updated time
- Overdue task indicators
- Direct edit and delete actions from details view

### 5. **Task Editing**
- Edit existing tasks inline
- Update title, description, due date, and priority
- Change task assignments (Admin only)
- Cancel editing to return to previous view

### 6. **Task Deletion**
- Delete tasks with confirmation dialog
- Prevents accidental deletions
- Removes task from all views immediately

### 7. **Task Status Management**
- Mark tasks as Pending, In Progress, or Completed
- Quick status update from task cards
- Color-coded status badges

### 8. **User Management (Admin Only)**
- View all registered users
- Add/remove users
- Change user roles (Admin/User)
- See task count per user
- Delete users with associated task cleanup

### 9. **Priority Management Board**
- Visual Kanban-style board with 4 priority columns
- Drag-and-drop tasks between priority levels
- Color-coded priority lists:
  - 🟢 **Low Priority** - Green
  - 🟡 **Medium Priority** - Yellow
  - 🟠 **High Priority** - Orange
  - 🔴 **Urgent** - Red
- Real-time task count per priority

### 10. **Dashboard**
- Welcome screen with user statistics
- Task overview by status
- Priority distribution charts
- Recent tasks list
- Quick action buttons

## 🎨 UI/UX Features

- Modern, responsive design
- Gradient backgrounds and smooth animations
- Mobile-friendly interface
- Color-coded priority and status indicators
- Intuitive navigation
- Loading states and transitions
- Overdue task warnings

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Pure CSS with modern design patterns
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: LocalStorage for persistence
- **Icons**: Unicode emojis for cross-platform compatibility

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd d:/Task/Task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

A demo admin account is automatically created on first run:
- **Username**: admin
- **Password**: admin123

You can also register new accounts through the registration page.

## 📂 Project Structure

```
src/
├── components/
│   ├── Login.jsx / Login.css
│   ├── Register.jsx / Register.css
│   ├── Navigation.jsx / Navigation.css
│   ├── Dashboard.jsx / Dashboard.css
│   ├── TaskForm.jsx / TaskForm.css
│   ├── TaskList.jsx / TaskList.css
│   ├── TaskItem.jsx / TaskItem.css
│   ├── TaskDetails.jsx / TaskDetails.css
│   ├── PriorityList.jsx / PriorityList.css
│   ├── Pagination.jsx / Pagination.css
│   ├── ConfirmDialog.jsx / ConfirmDialog.css
│   └── UserManagement.jsx / UserManagement.css
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## 🎯 Key Features Implementation

### Task Creation
- Forms with validation
- Date picker for due dates
- Priority selection dropdown
- User assignment for admins

### Pagination with AJAX
- Client-side pagination
- 5 tasks per page
- Dynamic page navigation
- Smooth transitions between pages

### Priority Management
- Drag-and-drop between priority lists
- Visual feedback on drag
- Automatic localStorage sync
- Color-coded columns

### User Authentication
- Secure login system
- Role-based access control
- Admin-only features
- User task filtering

## 🔒 Security Notes

This is a frontend-only application using localStorage for demonstration purposes. For production use:
- Implement backend API
- Add proper authentication (JWT, OAuth)
- Hash passwords
- Use secure database
- Add input validation and sanitization
- Implement CSRF protection

## 📱 Responsive Design

- Desktop: Full-featured layout
- Tablet: Optimized grid layouts
- Mobile: Single-column, touch-friendly interface

## 🎨 Color Scheme

- **Primary Gradient**: Purple to Violet (#667eea → #764ba2)
- **Success**: Green (#28a745)
- **Warning**: Yellow (#ffc107)
- **Danger**: Red (#e74c3c)
- **Info**: Blue (#0d6efd)

## 🚦 Usage Guide

1. **Login**: Use admin/admin123 or register a new account
2. **Dashboard**: View your task overview and statistics
3. **Create Task**: Click "Create Task" and fill in the form
4. **View Tasks**: Navigate to "All Tasks" to see your task list
5. **Edit/Delete**: Use action buttons on task cards
6. **Priority Board**: Drag tasks between priority columns
7. **User Management**: Admins can manage users from the Users tab

## 🤝 Contributing

This is a demonstration project. Feel free to fork and enhance!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer Notes

- All data is stored in browser localStorage
- Clear localStorage to reset the application
- No backend required for demonstration
- Fully functional offline after initial load

## 🎉 Features Checklist

- ✅ Task Creation with form validation
- ✅ Task List with pagination (5 per page)
- ✅ Task Details modal view
- ✅ Task Editing functionality
- ✅ Task Deletion with confirmation
- ✅ Task Status Updates
- ✅ User Authentication system
- ✅ Priority Management with drag-and-drop
- ✅ Color-coded priority lists
- ✅ User Management (Add/Remove users)
- ✅ Task Assignment to users
- ✅ Admin and User roles
- ✅ Responsive design
- ✅ Search and filter functionality
- ✅ Dashboard with statistics

---

Built with ❤️ using React + Vite
