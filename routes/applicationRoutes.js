const express = require("express");
const router = express.Router();
const controller = require("../controllers/applicationController");

router.post("/addApplication", controller.addApplication);
router.get("/getApplications", controller.getApplications);
router.put("/updateApplicationStatus/:id", controller.updateApplicationStatus);

module.exports = router;
