const express = require("express");

const app = express();
app.use(express.json());

const blogRoutes = require("./routes/blog");

app.use("/api/blog", blogRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});