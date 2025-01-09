const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");

router.get("/getEmployee", controller.getEmployees);
router.post("/addEmployee", controller.addEmployee);
router.put("/updateEmployee/:id", controller.updateEmployee);
router.delete("/deleteEmployee/:id", controller.deleteEmployee);

module.exports = router;
