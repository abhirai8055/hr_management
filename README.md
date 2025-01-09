This is a backend HR Management Application built with Node.js, Express.js, MySQL, and Joi for validation. It allows managing employees, job postings, and candidate applications.

# Features:

Employee CRUD: Add, update, retrieve, and delete employee records.
Job Posting CRUD: Add, update, retrieve, and delete job postings.
Application CRUD: Handle candidate applications, including status updates.
Technologies Used:
Node.js: JavaScript runtime for the backend.
Express.js: Web framework for Node.js.
MySQL: Relational database to store employees, job postings, and applications.
Joi: Schema validation for data integrity.

# Setup and Running the Project Locally

To set up and run this project locally, follow these steps:

- Prerequisites:
  Node.js: Ensure that Node.js is installed on your machine. If not, download and install it from nodejs.org.
  MySQL: You should have MySQL installed and running on your local machine.

- Steps to Get Started:
  Clone the Repository:

bash
Copy code
git clone https://github.com/abhirai8055/hr_management.git
cd repository-name

- Install Dependencies: Run the following command to install the required dependencies:

bash
Copy code
npm install
Set up MySQL Database:

- Create a MySQL database (e.g., hr_management_db).
  Add your database credentials to a .env file in the root of the project:
  makefile
  Copy code
  DB_HOST=localhost
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=hr_management_db
  Run the Application: To start the server, run:

bash
Copy code
npm start
The server will run on http://localhost:9000.

# API Endpoints

- Employees
  GET /api/employees: Fetch all employees.
  POST /api/employees: Create a new employee.
  PUT /api/employees/:id: Update employee details.
  DELETE /api/employees/:id: Delete an employee.
- Job Postings
  GET /api/jobs: Fetch all job postings.
  POST /api/jobs: Create a new job posting.
  PUT /api/jobs/:id: Update job posting details.
  DELETE /api/jobs/:id: Delete a job posting.
- Applications
  GET /api/applications: Fetch all candidate applications.
  POST /api/applications: Create a new application.
  PUT /api/applications/:id: Update application status.
  DELETE /api/applications/:id: Delete an application.

# Error Handling:

All endpoints have proper error handling to deal with:
Validation errors using Joi.
Database errors (e.g., if an employee, job, or application is not found).
Internal server errors for unexpected issues.
