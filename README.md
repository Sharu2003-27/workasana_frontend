# Workasana Task Management System

A full-stack task and project management application where teams can create projects, assign tasks, track progress, and generate reports.
Built to provide structured project tracking, team collaboration, and real-time task monitoring with an intuitive dashboard interface.

---

## Demo Link

[Live Demo](https://my-recipe-organizer.com)  

---

## Login

> **Guest**  
> Username: `guest_user`  
> Password: `guest_pass`

---

## Quick Start

```
git clone https://github.com/Sharu2003-27/workasana_frontend.git
cd <workasana_frontend>
npm install
npm run dev  
```

## Technologies

- React JS
- React Router
- Node.js
- Express
- MongoDB
- JWT Authentication
- Chart Library (for reports)

## Demo Video
Watch a walkthrough (5–7 minutes) of all major features of this app:
[Loom Video Link]()

## Features
**Login Screen**
- Basic email and password authentication
- Login button for user authentication
- Similar UI available for Signup

**Dashboard Screen**
- Sidebar navigation (Projects, Teams, Reports, Settings)
- Displays list of active projects
- Shows user-specific tasks
- Add New Task button
- Quick Filters:
    - In Progress
    - Completed

**Project Management Screen**
- Project-specific task listing
- Displays:
    - Task Status
    - Owner
    - Due Date
- Add New Task button
- Filter options:
    - By Owner
    - By Tag
- Sort options:
    - Due Date
    - Priority

**Task Creation Modal**
- Create new task within a project
- Fields include:
    - Task Name
    - Team (Dropdown Selection)
    - Owners (Multi-select)
    - Tags (Multi-select)
    - Due Date (Date Picker)
    - Estimated Time (Days)
- Create Task button

**Task Detail Screen**
- Displays complete task information:
    - Project Name
    - Team Name
    - Owners
    - Tags
    - Due Date
- Shows task status:
    - In Progress
    - Completed
- Time Remaining tracker
- Mark as Complete button

**Reports Screen**
- Displays analytical charts for:
    - Total Work Done Last Week
    - Total Days of Work Pending
    - Tasks Closed by Team
    - Tasks Closed by Owner
- Visual performance insights for better decision-

**Team Management Screen**
- View all existing teams
- Add New Team button
- Manage team structure
- Navigate back to Dashboard

## API Reference

### **GET /api/projects**<br>	 
List all projects<br>
Sample Response:<br>
```[{ _id, projectName, tasks, ... }, …]```

### **GET /api/projects/:id**<br>	 	
Get project details with tasks<br>		
Sample Response:<br>
```{ _id, projectName, tasks: [{ taskName, status, owner, dueDate }] }```

### **POST /api/tasks**<br> 	
Create a new task (Protected)<br>	
Sample Response:<br>
```{ _id, taskName, status, owner, dueDate }```

### **PUT /api/tasks/:id**<br>  	
Update task status or details (Protected)<br> 	 
Sample Response:<br> 
```{ _id, taskName, status: "Completed" }```

### **POST /api/auth/login**<br>
Authenticate user<br>
Sample Response:<br>
```{ userId, token }```

## Contact
For bugs or feature requests, please reach out to sharayu.borude@gmail.com