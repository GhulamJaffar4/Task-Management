# Advanced Task Management System - REST API

## Project Overview

The **Advanced Task Management System** is a RESTful API built using **Node.js**, **Express**, and **MongoDB**. It provides a robust task management solution with role-based access control, JWT authentication, and automated task reminders.

### Key Features

- **Multiple User Roles**: Admin, Manager, User
- **Role-Based Access Control** for tasks and operations
- **JWT Authentication** with session management
- **Task Management**:
  - Create, assign, update, and delete tasks
  - Update task status
  - Priority and due date management
- **Automated Email Reminders** for upcoming tasks
- **Fully Testable Endpoints** using API clients like Postman

---

## System Requirements

### User Roles & Permissions

| Role   | Permissions                                                                 |
|--------|-----------------------------------------------------------------------------|
| Admin  | Create users, assign roles, manage all tasks                                 |
| Manager| Create tasks, assign tasks to users, update own tasks                        |
| User   | View tasks assigned to them, update task status                              |

---

### Task Model

Each task includes the following fields:

- `title` (String) – Task title
- `description` (String) – Task details
- `assignedTo` (User ID) – User assigned to the task
- `status` (String) – e.g., Pending, In Progress, Completed
- `priority` (String) – e.g., Low, Medium, High
- `dueDate` (Date) – Deadline for task completion
- `createdBy` (User ID) – Task creator
- `createdAt` (Date) – Task creation timestamp

### Role-Based Restrictions

- Admin: Full access to all tasks and user management
- Manager: Can create tasks, assign tasks to users, and update tasks they created
- User: Can only update the status of tasks assigned to them

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repository_url>
cd <repository_folder>
