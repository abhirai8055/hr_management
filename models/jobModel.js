const { pool } = require("../config/db");
const createJobPostingsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Job_Postings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      department VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
     posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('open', 'closed') DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.execute(query);
  } catch (error) {
    console.error("Error creating Job_Postings table:", error);
  }
};

module.exports = createJobPostingsTable;
