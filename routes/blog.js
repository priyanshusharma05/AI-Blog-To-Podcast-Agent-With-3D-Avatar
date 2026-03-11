const express = require("express");
const router = express.Router();

const { convertBlog } = require("../controllers/blogController");

router.post("/convert", convertBlog);

module.exports = router;