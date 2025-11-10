Advanced Task Management System - REST API
Project Overview

The Advanced Task Management System is a REST API built with Node.js, Express, and MongoDB. It provides:

Multiple user roles: Admin, Manager, User

Role-based access control for tasks

JWT authentication and session management

Task creation, assignment, status updates

Automated reminders for upcoming tasks via email

Fully testable endpoints through an API client (Postman)

System Requirements
User Roles & Permissions
Role Permissions
Admin Create users, assign roles, manage all tasks
Manager Create tasks, assign tasks to users, update own tasks
User View tasks assigned to them, update task status

Task Management

Task fields: title, description, assignedTo, status, priority, dueDate, createdBy, createdAt

Role-based restrictions for create, update, delete

Users can update only their assigned task status

Setup Instructions:

1. Clone Repository
2. Install Dependencies
3. Configure Environment Variables
4. Start the Server
