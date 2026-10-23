
const express = require("express");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
require("dotenv").config();

const templateRoutes = require("./routes/template.route");
const websiteRoutes = require("./routes/website.route");
const mediaRoutes = require("./routes/media.route");
const categoryRoutes = require("./routes/category.route");

const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: Clerk middleware must run before API routes.
app.use(clerkMiddleware());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Website Builder API is running",
  });
});

app.use("/api/websites", websiteRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
