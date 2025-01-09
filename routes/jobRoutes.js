const express = require("express");
const router = express.Router();
const controller = require("../controllers/jobController");

router.get("/getAllJobPostings", controller.getAllJobPostings);
router.post("/addJobPosting", controller.addJobPosting);
router.put("/updateJobPosting/:id", controller.updateJobPosting);
router.delete("/deleteJobPosting/:id", controller.deleteJobPosting);

module.exports = router;
