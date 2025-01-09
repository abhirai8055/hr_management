const { pool } = require("../config/db");
const createEmployeeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(15),
      hire_date VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.execute(query);
  } catch (error) {
    console.error("Error creating Employees table:", error);
  }
};

module.exports = createEmployeeTable;
