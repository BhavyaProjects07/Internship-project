const express = require("express");
const cors = require("cors");
require("dotenv").config();

const templateRoutes = require("./routes/template.route");
const websiteRoutes = require("./routes/website.route");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Website Builder API is running",
  });
});
app.use("/api/websites", websiteRoutes);
app.use("/api/templates", templateRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
