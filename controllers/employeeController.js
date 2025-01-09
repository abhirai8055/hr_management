const { pool } = require("../config/db");
const Joi = require("joi");

const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM Employees");
    if (rows.length < 1) {
      return res.status(404).json({
        success: true,
        message: "no data avilable.",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "data found successfully.",
        data: rows,
      });
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees. Please try again later.",
    });
  }
};

const addEmployee = async (req, res) => {
  const employeeSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    designation: Joi.string().required(),
    department: Joi.string().required(),
    hire_date: Joi.string().optional(),
  });
  try {
    const validatedData = await employeeSchema.validateAsync(req.body);
    const hireDate = validatedData.hire_date || new Date().toISOString(); //
    // Check if email already exists
    const emailCheckQuery = `SELECT id FROM Employees WHERE email = ?`;
    const [rows] = await pool.execute(emailCheckQuery, [validatedData.email]);

    if (rows.length > 0) {
      // Email already exists
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }
    const insertQuery = `
      INSERT INTO Employees (name, email, designation, department, hire_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      validatedData.name,
      validatedData.email,
      validatedData.designation,
      validatedData.department,
      hireDate,
    ];

    await pool.execute(insertQuery, values);

    return res.status(200).json({
      success: true,
      message: "Employee added successfully",
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add employee. Please try again later.",
    });
  }
};

const updateEmployee = async (req, res) => {
  const { id } = req.params;

  const employeeSchema = Joi.object({
    name: Joi.string().min(3).max(255).optional(),
    email: Joi.string().email().optional(),
    designation: Joi.string().optional(),
    department: Joi.string().optional(),
    hire_date: Joi.string().optional(),
  });

  try {
    const validatedData = await employeeSchema.validateAsync(req.body);
    const findEmployeeQuery = "SELECT * FROM Employees WHERE id = ?";
    const [employee] = await pool.execute(findEmployeeQuery, [req.params.id]);

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // UPDATE query
    //  creating an array of field assignments like 'name = ?' and 'email = ?' based on the request data.
    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    // Checking each field and add it to the update query if provided
    if (validatedData.name) {
      fieldsToUpdate.push("name = ?");
      valuesToUpdate.push(validatedData.name);
    }
    if (validatedData.email) {
      fieldsToUpdate.push("email = ?");
      valuesToUpdate.push(validatedData.email);
    }
    if (validatedData.designation) {
      fieldsToUpdate.push("designation = ?");
      valuesToUpdate.push(validatedData.designation);
    }
    if (validatedData.department) {
      fieldsToUpdate.push("department = ?");
      valuesToUpdate.push(validatedData.department);
    }
    if (validatedData.hire_date) {
      fieldsToUpdate.push("hire_date = ?");
      valuesToUpdate.push(validatedData.hire_date);
    }

    // if no fields were provided to update
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    // adding the employee ID to the end of the values
    valuesToUpdate.push(req.params.id);

    // Joining these assignments into a single string separated by commas, like 'name = ?, email = ?'.
    const updateQuery = `UPDATE Employees SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = ?`;

    await pool.execute(updateQuery, valuesToUpdate);

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update employee. Please try again later.",
    });
  }
};

const deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const checkEmployeeQuery = "SELECT * FROM Employees WHERE id = ?";
    const [rows] = await pool.execute(checkEmployeeQuery, [employeeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const deleteQuery = "DELETE FROM Employees WHERE id = ?";
    await pool.execute(deleteQuery, [employeeId]);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete employee. Please try again later.",
    });
  }
};

module.exports = { getEmployees, addEmployee, updateEmployee, deleteEmployee };
