const { pool } = require("../config/db");
const Joi = require("joi");

const getAllJobPostings = async (req, res) => {
  try {
    const query = "SELECT * FROM Job_Postings";

    const [rows] = await pool.execute(query);

    // If no job postings are found
    if (rows.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No job postings found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job postings fetched successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job postings. Please try again later.",
    });
  }
};

const addJobPosting = async (req, res) => {
  const jobSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().required(),
    department: Joi.string().required(),
    location: Joi.string().required(),
    status: Joi.string().valid("open", "closed").optional().default("open"),
  });

  try {
    const validatedData = await jobSchema.validateAsync(req.body);

    const insertQuery = `
        INSERT INTO Job_Postings (title, description, department, location, status)
        VALUES (?, ?, ?, ?, ?)
      `;
    const values = [
      validatedData.title,
      validatedData.description,
      validatedData.department,
      validatedData.location,
      validatedData.status,
    ];

    await pool.execute(insertQuery, values);
    return res.status(201).json({
      success: true,
      message: "Job posting created successfully!",
    });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job posting. Please try again later.",
    });
  }
};

const updateJobPosting = async (req, res) => {
  const jobSchema = Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().optional(),
    department: Joi.string().optional(),
    location: Joi.string().optional(),
    status: Joi.string().valid("open", "closed").optional(),
  });

  const jobId = req.params.id;

  try {
    const validatedData = await jobSchema.validateAsync(req.body);
    const [jobRows] = await pool.execute(
      "SELECT id FROM Job_Postings WHERE id = ?",
      [jobId]
    );
    if (jobRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job posting not found.",
      });
    }
    const updateFields = [];
    const values = [];
    if (validatedData.title) {
      updateFields.push("title = ?");
      values.push(validatedData.title);
    }
    if (validatedData.description) {
      updateFields.push("description = ?");
      values.push(validatedData.description);
    }
    if (validatedData.department) {
      updateFields.push("department = ?");
      values.push(validatedData.department);
    }
    if (validatedData.location) {
      updateFields.push("location = ?");
      values.push(validatedData.location);
    }
    if (validatedData.status) {
      updateFields.push("status = ?");
      values.push(validatedData.status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update.",
      });
    }

    // Adding the jobId
    values.push(jobId);

    const updateQuery = `UPDATE Job_Postings SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;

    await pool.execute(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: "Job posting updated successfully!",
    });
  } catch (error) {
    console.error("Error updating job posting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job posting. Please try again later.",
    });
  }
};

const deleteJobPosting = async (req, res) => {
  const jobId = req.params.id;

  try {
    const [jobRows] = await pool.execute(
      "SELECT id FROM Job_Postings WHERE id = ?",
      [jobId]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job posting not found.",
      });
    }

    const deleteQuery = "DELETE FROM Job_Postings WHERE id = ?";
    await pool.execute(deleteQuery, [jobId]);

    return res.status(200).json({
      success: true,
      message: "Job posting deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete job posting. Please try again later.",
    });
  }
};

module.exports = {
  getAllJobPostings,
  addJobPosting,
  updateJobPosting,
  deleteJobPosting,
};
