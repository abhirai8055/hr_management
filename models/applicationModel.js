const { pool } = require("../config/db");

const createApplicationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT,
      candidate_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      resume_url VARCHAR(255) NOT NULL,
      status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
      applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES Job_Postings(id) ON DELETE CASCADE
    );
  `;

  try {
    await pool.execute(query);
  } catch (error) {
    console.error("Error creating Applications table:", error);
  }
};

module.exports = createApplicationsTable;
