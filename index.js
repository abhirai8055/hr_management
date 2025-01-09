const express = require("express");
const app = express();
const dotenv = require("dotenv");

//imports
const { initializeDatabase } = require("./config/db");
const createEmployeeTable = require("./models/employeeModel");
const createJobPostingsTable = require("./models/jobModel");
const createApplicationsTable = require("./models/applicationModel");
const employeeRoutes = require("./routes/employeeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

app.use(express.json());
app.use("/api/employees", employeeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
const PORT = process.env.PORT || 9000;

const startServer = async () => {
  try {
    await initializeDatabase();
    await createEmployeeTable();
    await createJobPostingsTable();
    await createApplicationsTable();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startServer();
