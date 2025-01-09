const { pool } = require("../config/db");
const Joi = require("joi");

const addApplication = async (req, res) => {
  const applicationSchema = Joi.object({
    job_id: Joi.number().integer().required(),
    candidate_name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    resume_url: Joi.string().uri().required(),
    status: Joi.string()
      .valid("pending", "accepted", "rejected")
      .default("pending"),
  });

  try {
    const validatedData = await applicationSchema.validateAsync(req.body);
    const jobCheckQuery = "SELECT id FROM Job_Postings WHERE id = ?";
    const [jobRows] = await pool.execute(jobCheckQuery, [validatedData.job_id]);

    if (jobRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job posting not found.",
      });
    }

    const insertQuery = `
    INSERT INTO Applications (job_id, candidate_name, email, resume_url, status)
    VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      validatedData.job_id,
      validatedData.candidate_name,
      validatedData.email,
      validatedData.resume_url,
      validatedData.status,
    ];

    await pool.execute(insertQuery, values);

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error("Error adding application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit application. Please try again later.",
    });
  }
};

const getApplications = async (req, res) => {
  try {
    // applications with related job details
    const query = `
      SELECT 
        a.id AS application_id,
        a.candidate_name,
        a.email,
        a.resume_url,
        a.status AS application_status,
        a.applied_date,
        j.title AS job_title,
        j.description AS job_description,
        j.department AS job_department,
        j.location AS job_location,
        j.status AS job_status
      FROM Applications a
      JOIN Job_Postings j ON a.job_id = j.id
    `;

    const [rows] = await pool.execute(query);

    if (rows.length < 1) {
      return res.status(404).json({
        success: true,
        message: "No applications found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications. Please try again later.",
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  const statusSchema = Joi.object({
    status: Joi.string()
      .valid("Pending", "Reviewed", "Accepted", "Rejected")
      .required(),
  });

  try {
    const validatedData = await statusSchema.validateAsync(req.body);

    const { id } = req.params;
    const { status } = validatedData;

    const [application] = await pool.execute(
      "SELECT * FROM Applications WHERE id = ?",
      [id]
    );

    if (application.length < 1) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found.`,
      });
    }

    const updateQuery = "UPDATE Applications SET status = ? WHERE id = ?";
    const [result] = await pool.execute(updateQuery, [status, id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Application status updated successfully.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to update the application status.",
      });
    }
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({
      success: false,
      message:
        "Failed to update the application status. Please try again later.",
    });
  }
};

module.exports = { addApplication, getApplications, updateApplicationStatus };
